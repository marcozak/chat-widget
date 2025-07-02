<script setup>
import { nextTick, ref, watch, onMounted, computed, onUnmounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { marked } from 'marked'
import { AnswerBuffer } from '@/utils/AnswerBuffer'
import { getWebSocketUrl, sendQuestion } from '@/utils/api'
import { getUserInfo } from '@/utils/auth'
import LogoutButton from '@/components/LogoutButton.vue'

import XIcon from '@/components/icons/XIcon.vue'
import SendIcon from '@/components/icons/SendIcon.vue'
import BackArrowIcon from '@/components/icons/BackArrowIcon.vue'
import ReloadIcon from '@/components/icons/ReloadIcon.vue'
import SparkIcon from '@/components/icons/SparkIcon.vue'
import PlugSparkIcon from '@/components/icons/PlugSparkIcon.vue'
import CTA from '@/components/CTA.vue'
import GeniusIcon from '@/components/GeniusIcon.vue'
import Menu from '@/components/Menu.vue'
import BlockDetails from '@/components/BlockDetails.vue'
import Suggestions from '@/components/Suggestions.vue'
import Carousel from '@/components/Carousel.vue'

import translations from '@/translations/translations.json'

const userInfo = ref(getUserInfo())
const open = ref(false)
const displayMenu = ref(true)
const displayCTA = ref(false)
const displayBlockDetails = ref(false)
const suggestionsArray = ref(null)
const blockToDisplay = ref(null)
const inputValue = ref('')
const chatHistory = ref([])
const awaitingFullResponse = ref(false)
const blackListRegex = /(<[^>]+>|<[^>]>|<\/[^>]+>)/ig
const refreshKey = ref(0)
const displayCarousel = ref(false)

const previousPanel = ref('chat') 

// Streaming response state
const aiStreamingResponse = ref('')
const answerBuffer = ref(null)
const formattedStreamingResponse = computed(() => {
    return aiStreamingResponse.value ? parseMarkdown(preserveMarkdownBlocks(aiStreamingResponse.value)) : ''
})

// Websocket state
const ws = ref(null)
const isConnected = ref(false)
const retryInterval = 3000
let retryTimeout = null
let pingInterval = null
let ctaTimeoutScheduled = false

// Keep track of markdown code blocks
const inCodeBlock = ref(false)

const sessionInfo = computed(() => {
    refreshKey.value
    return JSON.parse(localStorage.getItem('sessionInfo'))
})

// Function to ensure markdown code blocks remain complete during streaming
const preserveMarkdownBlocks = (content) => {
    // Count backticks to determine if we're in a code block
    const backtickMatches = content.match(/```/g)
    const backtickCount = backtickMatches ? backtickMatches.length : 0
    
    // If we have an odd number of ``` markers, add a closing one
    if (backtickCount % 2 !== 0) {
        return content + '\n```'
    }
    
    return content
}

// Parse markdown to HTML
const parseMarkdown = (text) => {
    try {
        return marked.parse(text)
    } catch (error) {
        console.error('Error parsing markdown:', error)
        return text
    }
}

// WebSocket connection handling
const connectWebSocket = () => {
    ws.value = new WebSocket(getWebSocketUrl(sessionInfo.value.sessionId))

    ws.value.onopen = () => {
        console.log("WebSocket connected.")
        isConnected.value = true
        if (retryTimeout) {
            clearTimeout(retryTimeout)
            retryTimeout = null
        }
        
        // Set up ping interval to keep connection alive
        pingInterval = setInterval(() => {
            if (ws.value && ws.value.readyState === WebSocket.OPEN) {
                ws.value.send(JSON.stringify({
                    session_id: sessionInfo.value.sessionId,
                    model_name: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                    type: 'ping',
                    workspace_id: 'f5e7f2c7-3f86-4972-9793-52ba603c9e3f'
                }))
            }
        }, 30000) // Send ping every 30 seconds
    }

    ws.value.onmessage = (event) => { 
        try {
            const data = JSON.parse(event.data)
            
            // Handle ping/pong
            if (data.type === 'pong') {
                console.log('Received pong from server')
                return
            }
            
            // Handle streaming tokens
            if (data.token !== undefined && data.type === 'token') {
                // Check if token contains code block markers
                if (data.token.includes('```')) {
                    inCodeBlock.value = !inCodeBlock.value
                }
                
                // Add token to buffer with sequence number
                answerBuffer.value.addPart(data.sequence, data.token)
                aiStreamingResponse.value = answerBuffer.value.output
                scrollToBottomOfChat('smooth')
            } 
            // Handle completion with final content
            else if (data.final_content && data.type === 'completion') {
                // Extract final content based on data structure
                let finalContent = ''
                if (data.final_content[0]?.text !== undefined) {
                    finalContent = data.final_content[0].text
                } else if (typeof data.final_content === 'string') {
                    finalContent = data.final_content
                }
                
                // Make sure any open code blocks are closed
                finalContent = preserveMarkdownBlocks(finalContent)
                
                // Update chat history with formatted response
                const formattedResponse = parseMarkdown(finalContent)
                
                // Add the completed response to chat history
                chatHistory.value.push({
                    sessionId: sessionInfo.value.sessionId,
                    responseIa: finalContent,
                    formattedResponse: formattedResponse,
                    dateCreated: new Date(),
                    type: 'response',
                    isComplete: true
                })
                
                // Reset state
                awaitingFullResponse.value = false
                aiStreamingResponse.value = ''
                inCodeBlock.value = false
                
                // Reset buffer for next response
                answerBuffer.value = new AnswerBuffer()
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error)
            awaitingFullResponse.value = false
            aiStreamingResponse.value = ''
        }
    }

    ws.value.onerror = (error) => {
        console.error("WebSocket error:", error)
        isConnected.value = false
        if (awaitingFullResponse.value) {
            awaitingFullResponse.value = false
            chatHistory.value.push({
                sessionId: sessionInfo.value.sessionId,
                responseIa: translations.aiResponseError,
                dateCreated: new Date(),
                type: 'response',
                isComplete: true
            })
        }
    }

    ws.value.onclose = (event) => {
        console.log(`WebSocket closed with code ${event.code}. Retrying...`)
        isConnected.value = false
        
        // Clear ping interval
        if (pingInterval) {
            clearInterval(pingInterval)
            pingInterval = null
        }
        
        // Reset state if closed during a response
        if (awaitingFullResponse.value) {
            awaitingFullResponse.value = false
            
            // Add a message indicating the connection was lost
            chatHistory.value.push({
                sessionId: sessionInfo.value.sessionId,
                responseIa: translations.connectionLostError || "Connection was lost. Please try again.",
                dateCreated: new Date(),
                type: 'response',
                isComplete: true
            })
        }
        
        attemptReconnect()
    }
}

// Retry connection mechanism
const attemptReconnect = () => {
    if (!isConnected.value) {
        retryTimeout = setTimeout(() => {
            console.log("Attempting to reconnect...")
            connectWebSocket()
        }, retryInterval)
    }
}

const closeWebSocket = () => {
    if (ws.value) {
        ws.value.close()
    }
    if (retryTimeout) {
        clearTimeout(retryTimeout)
    }
    if (pingInterval) {
        clearInterval(pingInterval)
    }
}

const openWindow = () => {
    refreshKey.value++
    open.value = true
    setTimeout(() => {
        if (chatHistory.value.length) displayChatWIndow()
    }, 100)
}

const closeWindow = () => {
    open.value = false
}

const goToMenu = () => {
    displayMenu.value = true
    displayBlockDetails.value = false
    inputValue.value = ''
}

const displayChatWIndow = () => {
    displayMenu.value = false
    displayBlockDetails.value = false
    blockToDisplay.value = null
    scrollToBottomOfChat('instant')
}

// Riferimento al DOM root del componente per Shadow DOM compatibility
const componentRoot = ref(null)

const scrollToBottomOfChat = async (behavior) => {
    // Fix per Shadow DOM: usa il ref al root element invece di document.getElementById
    // che cerca nel document globale e non funziona in Shadow DOM
    await nextTick()
    if (!componentRoot.value) return
    
    const chat = componentRoot.value.querySelector('#chat')
    if (chat && chat.lastElementChild) {
        chat.lastElementChild.scrollIntoView({ behavior, block: "end" })
    }
}

const addCTA = () => {
    displayCTA.value = true
    scrollToBottomOfChat('smooth')
}

const addCTAWithDelay = () => {
  if (ctaTimeoutScheduled || displayCTA.value || displayCarousel.value || displayMenu.value) return
  ctaTimeoutScheduled = true

  setTimeout(() => {
    if (!displayCTA.value && !displayCarousel.value && !displayMenu.value) {
      displayCTA.value = true
    }
    ctaTimeoutScheduled = false
  }, 60 * 1000)
}


const addCarousel = () => {
  displayCarousel.value = true
  scrollToBottomOfChat('smooth')
}

const handleBlockClicked = (index) => {
    displayMenu.value = false
    blockToDisplay.value = index
    displayBlockDetails.value = true
}

const handleSubBlockSelected = (title) => {
    displayChatWIndow()
    sendMessage(title)
}

const handleCtaClicked = () => {
    previousPanel.value = displayMenu.value ? 'menu' : 'chat'
    displayCTA.value = false
    displayCarousel.value = true
    displayMenu.value = false
}

const goBackFromCarousel = () => {
  displayCarousel.value = false
  if (previousPanel.value === 'menu') {
    displayMenu.value = true
  }
}

const handleCloseCarousel = () => {
  displayCarousel.value = false
}

const setChatHistory = (history) => {
    localStorage.setItem(
        'chatHistory',
        JSON.stringify({
            history
        })
    )
}

const getChatHistory = () => {
    const chatHistoryString = localStorage.getItem('chatHistory')
    if (chatHistoryString) {
        const historyToLoad = JSON.parse(chatHistoryString).history
        if (historyToLoad.length) {
            historyToLoad.forEach(el => {
                chatHistory.value.push(el)
            })
            addCTA()
            displayMenu.value = false
        }
    }
}

const setSessionInfo = () => {
    refreshKey.value++
    const id = uuidv4()
    const timestamp = new Date(Date.now()).toISOString()
    localStorage.setItem(
        'sessionInfo',
        JSON.stringify({
            sessionId: id,
            timestamp,
        })
    )
    setChatHistory([])
}

const getSessionInfo = () => {
    if (sessionInfo.value) {
        if (Date.now() - new Date(sessionInfo.value.timestamp).getTime() > (7 * 24 * 60 * 60 * 1000)) {
            localStorage.removeItem('sessionInfo')
            setSessionInfo()
        }
    } else {
        setSessionInfo()
    }
}

const initSession = () => {
    localStorage.removeItem('sessionInfo')
    closeWebSocket()
    setSessionInfo()
    chatHistory.value.length = 0
    displayMenu.value = true
    displayCTA.value = false
}

const sendMessage = async (content) => {
    const payload = {
        session_id: sessionInfo.value.sessionId,
        dateCreated: new Date(),
        type: 'question'
    }
    
    if (content) payload.content = content
    const sanitizedInputValue = inputValue.value.replace(blackListRegex, '')
    if (sanitizedInputValue) payload.content = sanitizedInputValue
    
    if (payload.hasOwnProperty('content')) {
        displayChatWIndow()
        displayCarousel.value = false
        suggestionsArray.value = null
        chatHistory.value.push(payload)
        inputValue.value = ''
        awaitingFullResponse.value = true
        
        // Initialize a new answer buffer and reset state
        answerBuffer.value = new AnswerBuffer()
        inCodeBlock.value = false

        try {
            // First, send the message via WebSocket for streaming
            if (ws.value && ws.value.readyState === WebSocket.OPEN) {
                const wsPayload = {
                    content: payload.content,
                    session_id: sessionInfo.value.sessionId,
                    model_name: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
                    type: 'question',
                    workspace_id: 'f5e7f2c7-3f86-4972-9793-52ba603c9e3f'
                }
                ws.value.send(JSON.stringify(wsPayload))
            } else {
                console.error('WebSocket not connected')
                
                // Try to reconnect
                connectWebSocket()
                
                // Add a message indicating connection issues
                chatHistory.value.push({
                    sessionId: sessionInfo.value.sessionId,
                    responseIa: translations.connectionError || "Connection to assistant failed. Please try again in a moment.",
                    dateCreated: new Date(),
                    type: 'response',
                    isComplete: true
                })
                
                awaitingFullResponse.value = false
                return
            }

            // In parallel, make the POST request to /ask endpoint to get proposals
            try {
                const askResponse = await sendQuestion(payload.content, sessionInfo.value.sessionId)
                
                // Handle the response from /ask - set proposals when they're ready
                if (askResponse && askResponse.proposals && askResponse.proposals.length > 0) {
                    // Save the proposals for suggestion buttons - we'll display them when the response is complete
                    if (!awaitingFullResponse.value) {
                        // If response is already complete, show proposals
                        suggestionsArray.value = askResponse.proposals
                    } else {
                        // Store proposals and will be shown when response completes
                        // We'll set this in the WebSocket's completion handler
                        pendingProposals = askResponse.proposals
                    }
                }
            } catch (proposalError) {
                console.error('Error fetching proposals:', proposalError)
                // Continue without proposals - this shouldn't stop the main conversation
            }
        } catch (error) {
            console.error('Error handling message:', error)
            awaitingFullResponse.value = false
            aiStreamingResponse.value = ''
            chatHistory.value.push({
                sessionId: sessionInfo.value.sessionId,
                responseIa: translations.aiResponseError,
                dateCreated: new Date(),
                type: 'response',
                isComplete: true
            })
        }
    }
}

// Keep track of pending proposals to show when response completes
let pendingProposals = null

watch(chatHistory.value, async () => {
    setChatHistory(chatHistory.value)
    if (open.value) scrollToBottomOfChat('smooth')
    
    // Check if we need to display CTA for first message
    if (!displayCTA.value && !displayCarousel.value) {
        addCTAWithDelay()
    }
    
    // Check if the most recent message is a complete response
    const lastMessage = chatHistory.value[chatHistory.value.length - 1]
    if (lastMessage && lastMessage.type === 'response' && lastMessage.isComplete && pendingProposals) {
        // Show proposals after the response is complete
        suggestionsArray.value = pendingProposals
        pendingProposals = null
    }
})

onMounted(() => {
    getSessionInfo()
    getChatHistory()
    answerBuffer.value = new AnswerBuffer()
    connectWebSocket()
})

onUnmounted(() => {
    closeWebSocket()
})
</script>

<template>
  <div ref="componentRoot">
    <Transition 
        enter-active-class="transition-opacity duration-1000"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
    >
        <div v-if="!open" class="absolute bottom-3 right-4 bg-black border-gray-dark border-8 rounded-full w-16 h-16 md:w-20 md:h-20 flex justify-center items-center">
            <button style="background-color: transparent; border: none;" @click="openWindow()">
                <div>
                    <GeniusIcon class="mt-2"/>
                </div>
            </button>
        </div>
    </Transition>
    <Transition 
        enter-active-class="transition duration-700 transform"
        leave-active-class="transition duration-700 transform"
        enter-from-class="opacity-0 translate-y-full"
        leave-to-class="opacity-0 translate-y-full"
    >
        <div v-if="open" class="flex flex-col justify-between items-center fixed bottom-0 right-0 md:bottom-1 md:right-4 w-screen h-dynamic md:w-[375px] md:h-[640px] overflow-hidden"
  :style="{ maxHeight: '100vh' }">
            <div class="flex justify-between w-full h-[90px] px-5 bg-black md:rounded-t-2xl">
                <button 
                    @click="goToMenu()" 
                    :disabled="awaitingFullResponse"
                    class="flex items-center"
                    :class="awaitingFullResponse ? 'opacity-40 cursor-not-allowed' : ''"
                >
                    <BackArrowIcon />
                    <p class="text-white text-xs font-PeugeotNew ml-2">{{ translations.Menu.label }}</p>
                </button>
                <button @click="closeWindow()" class="z-20 relative">
                    <XIcon/>
                </button>
            </div>
            <div class="w-full bg-gradient-to-b from-black to-gray-dark h-full flex overflow-y-scroll no-scrollbar">
                <div 
                    id="chat"
                    class="w-full bg-gray-dark rounded-t-3xl h-full flex overflow-y-scroll no-scrollbar"
                >
                    <div 
                        v-if="!displayBlockDetails"
                        class="flex flex-col items-center w-48 grow"
                        :class="chatHistory.length ? 'mt-auto' : 'justify-center'"
                    >
                        <div 
                            v-if="chatHistory.length"
                            class="pt-5 h-full w-full flex flex-col"
                            :class="displayCTA ? 'pb-14' : ''"
                        >
                            <div 
                                v-for="(message, index) in chatHistory"
                                :key="index"
                                class="flex flex-col"
                            >
                                <div v-if="!message.carousel" class="flex">
                                    <GeniusIcon 
                                        v-if="message.responseIa"
                                        class="mb-1 mt-auto ml-5 w-[50px] h-[50px]"
                                    />
                                    <div 
                                        class="rounded-t-2xl p-3 mb-1 break-normal w-64 xs:w-72 sm:w-64 min-h-10 text-left"
                                        :class="message.content ? 'bg-white text-gray-900 rounded-bl-2xl mr-5 ml-auto' : 'bg-blue text-white rounded-br-2xl ml-3 mr-auto'"
                                    >
                                        <div 
                                            v-if="message.url && message.responseWithoutUrl && !message.content"
                                            class="text-gray-900"
                                        >
                                            <p class="font-PeugeotNew text-xs">
                                                {{ `${message.responseWithoutUrl[0]} : ` }}
                                                <a class="font-PeugeotNewBold" :href="message.url" target="_blank" rel="noopener noreferrer">{{ translations.clickHere }}</a>
                                            </p>
                                            <p class="font-PeugeotNew text-xs">
                                                {{ message.responseWithoutUrl[1] }}
                                            </p>
                                        </div>
                                        <div v-else-if="message.content" class="font-PeugeotNew text-xs" style="color: #111827;">
                                            {{ message.content }}
                                        </div>
                                        <div v-else class="font-PeugeotNew text-xs markdown-content" v-html="message.formattedResponse || (message.responseIa ? parseMarkdown(message.responseIa) : '')"></div>
                                    </div>
                                </div>
                                <p 
                                    v-if="!message.carousel"
                                    class="font-PeugeotNew text-gray text-[8px] mb-1"
                                    :class="message.content ? 'text-right pr-5' : 'text-left ml-16 pl-5'"
                                > 
                                    {{ new Date(message.dateCreated).getHours() }}:{{ (new Date(message.dateCreated).getMinutes() < 10 ? '0' : '') + new Date(message.dateCreated).getMinutes()}}
                                </p>
                                <Carousel 
                                    v-if="message.carousel"
                                />
                            </div>
                            <Suggestions 
                                v-if="suggestionsArray" 
                                :suggestions="suggestionsArray"
                                @send-suggestion="sendMessage"
                            />
                            <div v-if="awaitingFullResponse" class="flex">
                                <GeniusIcon 
                                    class="mb-1 mt-auto ml-5 w-[50px] h-[50px]"
                                />
                                <div 
                                    class="rounded-t-2xl p-3 mb-1 break-normal w-64 xs:w-72 sm:w-64 min-h-10 text-left"
                                    :class="'bg-blue text-white rounded-br-2xl ml-3 mr-auto'"
                                >
                                    <div v-if="aiStreamingResponse" class="font-PeugeotNew text-xs markdown-content" v-html="formattedStreamingResponse"></div>
                                    <p v-else class="text-white font-PeugeotNew text-xs">{{ translations.pendingAiAnswer }}</p>
                                </div>
                            </div>
                            <Transition 
                                enter-active-class="transition duration-500 transform"
                                leave-active-class="transition duration-500 transform"
                                enter-from-class="opacity-0 scale-110"
                                leave-to-class="opacity-0 scale-110"
                                > 
                                <div
                                    v-if="displayCTA && !displayCarousel"
                                    class="z-50 absolute bottom-24 w-full px-5 tall:pb-1 pt-2"
                                    :class="displayMenu ? 'hidden': ''"
                                >
                                    <CTA @cta-clicked="handleCtaClicked" />
                                </div>
                            </Transition>
                        </div>
                    </div>
                    <BlockDetails 
                        v-if="displayBlockDetails" 
                        :index="blockToDisplay" 
                        @sub-block-selected="handleSubBlockSelected"
                    />
                </div>
            </div>
            <div class="z-20 relative inline-block w-full h-[90px] pt-2 tall:pt-3 pb-10 px-5 bg-gray-dark md:rounded-b-2xl">
                <input
                v-model="inputValue"
                :disabled="awaitingFullResponse"
                type="text"
                class="rounded-full w-full h-[48px] font-PeugeotNew text-xs text-gray-900 focus:border-transparent focus:outline-none pl-3 pr-12"
                :style="{ color: '#111827' }"
                :placeholder="translations.inputPlaceholder"
                @keyup.enter="sendMessage()"
                />
                <button v-if="inputValue !=''" @click="sendMessage()" class="absolute top-3 tall:top-4 right-6 border-0 bg-transparent cursor-pointer"> 
                    <SendIcon />
                </button> 
                <Transition 
                    enter-active-class="transition duration-700 transform"
                    leave-active-class="transition duration-700 transform"
                    enter-from-class="opacity-0 translate-y-full"
                    leave-to-class="opacity-0 translate-y-full"
                >
                    <button
                        v-if="!displayMenu && !displayBlockDetails && chatHistory.length"
                        :disabled="awaitingFullResponse"
                        @click="initSession()"
                        class="flex w-full pt-2 justify-center items-center"
                        :class="awaitingFullResponse ? 'opacity-20 cursor-not-allowed' : ''"
                    >
                        <p class="text-white text-xs underline font-PeugeotNew mr-2">
                            {{ translations.sessionInit }}
                        </p>
                        <ReloadIcon />
                    </button>
                </Transition>
            </div>
            <div v-if="displayMenu" class="absolute z-10 top-0 w-screen md:w-[375px] bg-gray-dark md:rounded-2xl h-full">
                <Menu 
                    @block-cliked="handleBlockClicked"
                    @cta-clicked="handleCtaClicked"
                />
            </div>
            <!-- Carousel Overlay -->
            <div
                v-if="displayCarousel"
                class="absolute z-10 top-0 w-screen h-full md:w-[375px] md:h-[640px] bg-gray-dark md:rounded-2xl overflow-y-auto no-scrollbar"    
                :style="{ height: 'calc(100% - 90px)' }"
            >
            <Carousel @go-back="goBackFromCarousel" />
            </div>
        </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Markdown content styling */
.markdown-content :deep(h1) {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 0.75rem;
    margin-bottom: 0.5rem;
}

.markdown-content :deep(h2) {
    font-size: 1.25rem;
    font-weight: bold;
    margin-top: 0.75rem;
    margin-bottom: 0.5rem;
}

.markdown-content :deep(h3) {
    font-size: 1.1rem;
    font-weight: bold;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}

.markdown-content :deep(h4), 
.markdown-content :deep(h5), 
.markdown-content :deep(h6) {
    font-size: 1rem;
    font-weight: bold;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}

.markdown-content :deep(p) {
    margin-bottom: 0.5rem;
}

.markdown-content :deep(ul), 
.markdown-content :deep(ol) {
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;
}

.markdown-content :deep(ul) {
    list-style-type: disc;
}

.markdown-content :deep(ol) {
    list-style-type: decimal;
}

.markdown-content :deep(li) {
    margin-bottom: 0.25rem;
}

.markdown-content :deep(a) {
    color: #3b82f6;
    text-decoration: underline;
}

.markdown-content :deep(strong) {
    font-weight: bold;
}

.markdown-content :deep(em) {
    font-style: italic;
}

.markdown-content :deep(code) {
    font-family: monospace;
    background-color: rgba(255, 255, 255, 0.15);
    padding: 0.1rem 0.3rem;
    border-radius: 0.25rem;
}

.markdown-content :deep(pre) {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 0.5rem;
    border-radius: 0.25rem;
    overflow-x: auto;
    margin-bottom: 0.5rem;
}

.markdown-content :deep(blockquote) {
    border-left: 3px solid #9ca3af;
    padding-left: 0.5rem;
    margin-left: 0.5rem;
    color: #9ca3af;
}

.markdown-content :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 0.5rem;
}

.markdown-content :deep(th), 
.markdown-content :deep(td) {
    border: 1px solid #4b5563;
    padding: 0.25rem;
}

.markdown-content :deep(th) {
    background-color: rgba(255, 255, 255, 0.1);
}
</style>