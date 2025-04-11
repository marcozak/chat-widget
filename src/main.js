import { createApp } from 'vue'
import ChatWindow from './components/ChatWindow.vue'
import './assets/main.css'

function initChatWidget(options = {}) {
  const mountPoint = document.createElement('div')
  mountPoint.id = 'chat-widget'
  document.body.appendChild(mountPoint)

  const app = createApp(ChatWindow)
  app.mount('#chat-widget')
}

// Espone la funzione globale
window.ChatWidget = {
  init: initChatWidget
}
