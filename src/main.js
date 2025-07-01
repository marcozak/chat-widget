import { createApp } from 'vue'
import ChatWindow from './components/ChatWindow.vue'
import shadowCss from './assets/shadow-dom.css?inline'

// Auto-initialization logic
let isAutoInitialized = false;

function mountPeugeotWidget(config = {}) {
  console.log('🚀 Initializing Peugeot Chat Widget with Shadow DOM...', config);
  
  try {
    // 1. Trova o crea il contenitore
    let container = document.getElementById(config.chatRoot || 'chat-root');
    console.log('📦 Container found:', container);
    
    if (!container) {
      console.log('📦 Creating new container...');
      container = document.createElement('div');
      container.id = config.chatRoot || 'chat-root';
      container.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: 2147483647 !important;
        pointer-events: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        transform: none !important;
        background: transparent !important;
        border: none !important;
        overflow: visible !important;
      `;
      document.body.appendChild(container);
      console.log('📦 Container created and appended to body');
    }

    // 2. Verifica se lo shadow root esiste già
    let shadow = container.shadowRoot;
    if (shadow) {
      console.log('⚠️ Shadow DOM already exists, skipping initialization');
      return;
    }

    console.log('🌘 Creating Shadow DOM...');
    shadow = container.attachShadow({ mode: 'open' });
    
    // 3. Aggiungi CSS isolato
    console.log('🎨 Injecting CSS into Shadow DOM...');
    const style = document.createElement('style');
    style.textContent = shadowCss;
    shadow.appendChild(style);
    console.log('🎨 CSS injected, length:', shadowCss.length);

    // 4. Crea il nodo root per Vue
    console.log('🏗️ Creating Vue app root...');
    const appRoot = document.createElement('div');
    appRoot.id = 'peugeot-widget-app';
    appRoot.style.cssText = `
      all: initial;
      position: relative;
      display: block;
      font-family: 'PeugeotNew', -apple-system, BlinkMacSystemFont, sans-serif;
    `;
    shadow.appendChild(appRoot);
    console.log('🏗️ App root created');

    // 5. Monta Vue app
    console.log('⚡ Mounting Vue app...');
    const app = createApp(ChatWindow);
    
    // Passa la config come global property invece che come prop
    app.config.globalProperties.$widgetConfig = config;
    
    // Debug Vue mounting
    app.config.errorHandler = (err, vm, info) => {
      console.error('🚨 Vue Error:', err, info);
    };
    
    app.mount(appRoot);
    console.log('⚡ Vue app mounted successfully');

    console.log('🎉 Peugeot Chat Widget successfully mounted in Shadow DOM!')
    console.log('🛡️ Widget is now completely isolated from host page CSS')
    
    // Debug: verifica che il shadow DOM sia effettivamente isolato
    setTimeout(() => {
      const shadowStyles = shadow.querySelectorAll('style');
      const appContent = shadow.querySelector('#peugeot-widget-app');
      console.log('🔍 Shadow DOM check:');
      console.log('  - Styles in shadow:', shadowStyles.length);
      console.log('  - App content:', appContent);
      console.log('  - App children:', appContent?.children.length);
    }, 100);

  } catch (error) {
    console.error('💥 Error mounting widget:', error);
    console.error('Stack:', error.stack);
  }
}

// Global API
window.ChatWidget = {
  init: () => {
    console.log('🎯 ChatWidget.init() called');
    if (isAutoInitialized) {
      console.log('⚠️ Widget already auto-initialized, skipping manual init');
      return;
    }
    mountPeugeotWidget(window.CHAT_WIDGET_CONFIG || {});
  }
};

// Auto-initialization quando il DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, auto-initializing widget...');
    mountPeugeotWidget(window.CHAT_WIDGET_CONFIG || {});
    isAutoInitialized = true;
  });
} else {
  console.log('📄 DOM already loaded, auto-initializing widget immediately...');
  mountPeugeotWidget(window.CHAT_WIDGET_CONFIG || {});
  isAutoInitialized = true;
}

console.log('📝 Peugeot Chat Widget script loaded');
