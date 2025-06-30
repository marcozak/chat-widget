import { createApp } from 'vue'
import ChatWindow from './components/ChatWindow.vue'
import './assets/main.css'

function initChatWidget(options = {}) {
  const mountPoint = document.createElement('div')
  mountPoint.id = 'chat-widget'
  mountPoint.className = 'peugeot-widget'
  // Stili inline per maggiore robustezza
  mountPoint.style.position = 'fixed'
  mountPoint.style.top = '0'
  mountPoint.style.left = '0'
  mountPoint.style.width = '100%'
  mountPoint.style.height = '100%'
  mountPoint.style.pointerEvents = 'none'
  mountPoint.style.zIndex = '999997'
  mountPoint.style.fontFamily = "'PeugeotNew', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
  mountPoint.style.fontSize = '12px'
  mountPoint.style.lineHeight = '1.5'
  
  document.body.appendChild(mountPoint)

  const app = createApp(ChatWindow)
  app.mount('#chat-widget')
}

// Espone la funzione globale
window.ChatWidget = {
  init: initChatWidget
}
