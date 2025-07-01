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
    console.log('📊 Shadow CSS length:', shadowCss.length);
    console.log('📊 Shadow CSS preview:', shadowCss.substring(0, 200));
    console.log('📊 Shadow CSS contains PeugeotNew:', shadowCss.includes('PeugeotNew'));
    console.log('📊 Shadow CSS contains font-face:', shadowCss.includes('@font-face'));
    console.log('📊 Shadow CSS contains Tailwind:', shadowCss.includes('.flex{'));
    
    const style = document.createElement('style');
    
    // STRATEGIA ALTERNATIVA: Forziamo TUTTO il CSS del widget con !important
    // Modifico shadowCss per aggiungere !important a tutte le regole critiche
    let forcedCss = shadowCss
      // Forza dimensioni e posizioni
      .replace(/width:\s*([^;]+);/g, 'width: $1 !important;')
      .replace(/height:\s*([^;]+);/g, 'height: $1 !important;')
      .replace(/font-family:\s*([^;]+);/g, 'font-family: $1 !important;')
      .replace(/font-size:\s*([^;]+);/g, 'font-size: $1 !important;')
      .replace(/background:\s*([^;]+);/g, 'background: $1 !important;')
      .replace(/background-color:\s*([^;]+);/g, 'background-color: $1 !important;')
      .replace(/border-radius:\s*([^;]+);/g, 'border-radius: $1 !important;')
      .replace(/display:\s*([^;]+);/g, 'display: $1 !important;')
      .replace(/position:\s*([^;]+);/g, 'position: $1 !important;')
      .replace(/transform:\s*([^;]+);/g, 'transform: $1 !important;');
    
    console.log('🔧 CSS Transformation Debug:');
    console.log('  - Original CSS length:', shadowCss.length);
    console.log('  - Forced CSS length:', forcedCss.length);
    console.log('  - Added !important rules:', forcedCss.length - shadowCss.length);
    console.log('  - Contains !important width:', forcedCss.includes('width:') && forcedCss.includes('!important'));
    console.log('  - Contains !important font-family:', forcedCss.includes('font-family:') && forcedCss.includes('!important'));
    
    style.textContent = `
      /* RESET PRIORITARIO - PRIMA DI TUTTO */
      :host {
        font-size: 16px !important;
        line-height: 1.5 !important;
      }
      
      #peugeot-widget-app {
        font-size: 16px !important;
        line-height: 1.5 !important;
      }
      
      /* RESET TOTALE PER SHADOW DOM */
      * {
        box-sizing: border-box !important;
        font-size: inherit !important;
      }
      
      /* Annulla TUTTO il CSS ostile della pagina host */
      *:not(:host) {
        margin: unset !important;
        padding: unset !important;
        width: unset !important;
        height: unset !important;
        background: unset !important;
        border: unset !important;
        transform: unset !important;
        color: unset !important;
      }
      
      /* Reset specifico per il root del widget */
      :host {
        all: initial !important;
        display: block !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
        font-size: 16px !important;
        line-height: 1.5 !important;
        color: #000 !important;
        background: transparent !important;
      }
      
      /* CSS FORZATO DEL WIDGET */
      ${forcedCss}
      
      /* OVERRIDE FINALE per elementi critici */
      [data-v-443d312e] {
        font-family: PeugeotNew, -apple-system, BlinkMacSystemFont, sans-serif !important;
        font-size: 16px !important;
      }
      
      .font-PeugeotNew {
        font-family: PeugeotNew, -apple-system, BlinkMacSystemFont, sans-serif !important;
      }
      
      /* Forza le dimensioni del bottone widget */
      [data-v-443d312e].fixed,
      [data-v-443d312e].absolute {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        width: auto !important;
        height: auto !important;
        transform: none !important;
        font-size: 16px !important;
      }
    `;
    shadow.appendChild(style);
    console.log('🎨 CSS injected with browser defaults + our styles');

    // 4. Crea il nodo root per Vue
    console.log('🏗️ Creating Vue app root...');
    const appRoot = document.createElement('div');
    appRoot.id = 'peugeot-widget-app';
    // Nessuno stile inline - lascia che il CSS funzioni normalmente
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
      
      // Debug più approfondito per problemi Shadow DOM + Vue
      if (appContent) {
        console.log('🐛 Vue + Shadow DOM Debug:');
        console.log('  - appRoot innerHTML length:', appContent.innerHTML.length);
        console.log('  - appRoot has Vue instance:', appContent.__vue__);
        
        // Controlla se Vue ha trovato i suoi elementi
        const vueElements = appContent.querySelectorAll('[data-v-]');
        console.log('  - Vue scoped elements found:', vueElements.length);
        
        // Controlla errori di mounting
        const buttons = appContent.querySelectorAll('button');
        const inputs = appContent.querySelectorAll('input');
        console.log('  - Buttons rendered:', buttons.length);
        console.log('  - Inputs rendered:', inputs.length);
        
        // Test stili applicati
        if (buttons.length > 0) {
          const firstButton = buttons[0];
          const computedStyle = getComputedStyle(firstButton);
          console.log('  - Button computed styles:');
          console.log('    - Display:', computedStyle.display);
          console.log('    - Background:', computedStyle.backgroundColor);
          console.log('    - Font family:', computedStyle.fontFamily);
          console.log('    - Width:', computedStyle.width);
          console.log('    - Height:', computedStyle.height);
          console.log('    - Border radius:', computedStyle.borderRadius);
        }
        
        // Test se Vue riesce a trovare gli elementi con querySelector nel suo scope
        const chatElement = appContent.querySelector('#chat');
        console.log('  - Chat element found by Vue scope:', !!chatElement);
        if (chatElement) {
          console.log('    - Chat element dimensions:', {
            width: chatElement.offsetWidth,
            height: chatElement.offsetHeight,
            scrollHeight: chatElement.scrollHeight
          });
        }
        
        // Test specifico per fix Shadow DOM
        const widgetButton = appContent.querySelector('[data-cy="widget-button"]');
        console.log('  - Widget button found:', !!widgetButton);
        if (widgetButton) {
          const buttonStyle = getComputedStyle(widgetButton);
          console.log('    - Button is visible:', buttonStyle.display !== 'none');
          console.log('    - Button position:', buttonStyle.position);
          console.log('    - Button z-index:', buttonStyle.zIndex);
        }
        
        // Verifica che gli stili Tailwind siano applicati
        const tailwindElements = appContent.querySelectorAll('.bg-blue-500, .text-white, .rounded, .p-4, .m-2');
        console.log('  - Elements with Tailwind classes:', tailwindElements.length);
        
        // Debug più specifico per le classi Tailwind del widget
        const flexElements = appContent.querySelectorAll('.flex');
        const bgElements = appContent.querySelectorAll('[class*="bg-"]');
        const textElements = appContent.querySelectorAll('[class*="text-"]');
        console.log('  - Flex elements found:', flexElements.length);
        console.log('  - Background elements found:', bgElements.length);
        console.log('  - Text elements found:', textElements.length);
        
        // Test specifico per il bottonet del widget
        const buttonElement = appContent.querySelector('.absolute.bottom-3.right-4');
        console.log('  - Widget button element found:', !!buttonElement);
        if (buttonElement) {
          const buttonStyle = getComputedStyle(buttonElement);
          console.log('    - Button computed position:', buttonStyle.position);
          console.log('    - Button computed bottom:', buttonStyle.bottom);
          console.log('    - Button computed right:', buttonStyle.right);
        }
        
        // Test scroll funzionante (importante per la fix dell'accesso DOM)
        if (chatElement && chatElement.scrollHeight > 0) {
          console.log('  - Chat scroll functionality test: PASSED');
        } else {
          console.log('  - Chat scroll functionality test: FAILED');
        }
      }
      
      // Test accesso DOM esterno (problema che hai menzionato)
      console.log('🌍 DOM Access Test:');
      console.log('  - Can access document.body:', !!document.body);
      console.log('  - Can access window:', !!window);
      console.log('  - Shadow root parent:', shadow.host);
      console.log('  - getRootNode():', appContent?.getRootNode() === shadow);
    }, 500); // Aumentato timeout per Vue

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

// Auto-initialization SOLO se non chiamata manualmente
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Non fare auto-init, aspetta la chiamata manuale
    console.log('📄 DOM loaded, waiting for manual init...');
  });
} else {
  // Non fare auto-init, aspetta la chiamata manuale
  console.log('📄 DOM already loaded, waiting for manual init...');
}

console.log('📝 Peugeot Chat Widget script loaded');
