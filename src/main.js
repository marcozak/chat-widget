import { createApp } from 'vue'
import ChatWindow from './components/ChatWindow.vue'
import shadowCss from './assets/shadow-dom.css?inline'

function initChatWidget(options = {}) {
  // Configurazione di default
  const config = {
    chatRoot: 'chat-root',
    position: 'bottom-right',
    assetBaseUrl: '',
    ...window.CHAT_WIDGET_CONFIG,
    ...options
  }

  console.log('🚀 Initializing Peugeot Chat Widget with Shadow DOM...', config)

  // 1. Trova o crea il contenitore principale
  let container = document.getElementById(config.chatRoot)
  if (!container) {
    container = document.createElement('div')
    container.id = config.chatRoot
    container.style.position = 'fixed'
    container.style.zIndex = '999999'
    container.style.pointerEvents = 'none' // Il container non intercetta eventi
    
    // Posizionamento basato sulla config
    if (config.position === 'bottom-right') {
      container.style.bottom = '20px'
      container.style.right = '20px'
    } else if (config.position === 'bottom-left') {
      container.style.bottom = '20px'
      container.style.left = '20px'
    }
    
    document.body.appendChild(container)
  }

  // 2. Crea o ottieni lo Shadow Root
  let shadow = container.shadowRoot
  if (!shadow) {
    shadow = container.attachShadow({ mode: 'open' })
    
    // 3. Inietta tutto il CSS necessario nel Shadow DOM
    const style = document.createElement('style')
    
    // Sostituisci i percorsi relativi dei font con l'URL assoluto dalla config
    let processedCss = shadowCss
    if (config.assetBaseUrl) {
      processedCss = processedCss.replace(
        /url\('\.\/fonts\//g,
        `url('${config.assetBaseUrl.replace('/images', '')}/fonts/`
      )
    }
    
    style.textContent = processedCss
    shadow.appendChild(style)
    
    // 4. Crea il punto di mount per l'app Vue
    const appRoot = document.createElement('div')
    appRoot.id = 'peugeot-widget-app'
    appRoot.style.pointerEvents = 'auto' // Il widget può intercettare eventi
    shadow.appendChild(appRoot)
    
    // 5. Monta l'app Vue nel Shadow DOM
    const app = createApp(ChatWindow, { config })
    app.mount(appRoot)
    
    console.log('🎉 Peugeot Chat Widget successfully mounted in Shadow DOM!')
    console.log('🛡️ Widget is now completely isolated from host page CSS')
  } else {
    console.log('⚠️ Shadow DOM already exists, skipping initialization')
  }
  
  return { container, shadow }
}

// Espone la funzione globale per compatibilità GTM
window.ChatWidget = {
  init: initChatWidget,
  version: '2.0.0-shadow'
}

// Auto-init se configurazione è già presente
if (typeof window !== 'undefined' && window.CHAT_WIDGET_CONFIG) {
  // Aspetta che il DOM sia pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initChatWidget())
  } else {
    // DOM già pronto
    setTimeout(() => initChatWidget(), 100)
  }
}
