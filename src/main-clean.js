import { createApp } from 'vue'
import ChatWindow from './components/ChatWindow.vue'
import shadowCss from './assets/shadow-dom.css?inline'
import tailwindCss from './assets/tailwind-essential.css?inline'

// Auto-initialization logic
let isAutoInitialized = false;

function mountPeugeotWidget(config = {}) {
  return mountPeugeotWidgetAsync(config);
}

async function mountPeugeotWidgetAsync(config = {}) {
  console.log('🚀 Initializing Peugeot Chat Widget with Shadow DOM...', config);
  
  try {
    // 1. Trova o crea il contenitore
    let container = document.getElementById(config.chatRoot || 'chat-root');
    
    if (!container) {
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
    }

    // 2. Verifica se lo shadow root esiste già
    let shadow = container.shadowRoot;
    if (shadow) {
      console.log('⚠️ Shadow DOM already exists, skipping initialization');
      return;
    }

    shadow = container.attachShadow({ mode: 'open' });
    
    // 3. Prepara e aggiungi CSS al Shadow DOM
    const allCss = tailwindCss + '\n\n' + shadowCss;
    
    // Converti unità viewport in px per compatibilità Shadow DOM
    let processedCss = allCss
      .replace(/100vw/g, '375px')
      .replace(/100vh/g, '640px')
      .replace(/(\d+)vw/g, (match, p1) => Math.round(p1 * 3.75) + 'px')
      .replace(/(\d+)vh/g, (match, p1) => Math.round(p1 * 6.4) + 'px');
    
    const style = document.createElement('style');
    style.textContent = `
      /* Reset minimale per Shadow DOM */
      :host {
        all: initial !important;
        display: block !important;
        background: transparent !important;
      }
      
      * {
        box-sizing: border-box !important;
      }
      
      /* CSS del widget con fix viewport units */
      ${processedCss}
      
      /* Fix per dimensioni mobile */
      .w-screen {
        width: 375px !important;
      }
      
      .md\\:w-\\[375px\\] {
        width: 375px !important;
      }
      
      .md\\:h-\\[640px\\] {
        height: 640px !important;
      }
      
      /* Fix per Swiper carousel */
      swiper-container,
      swiper-slide {
        max-width: 375px !important;
        overflow: hidden !important;
      }
      
      .swiper-wrapper {
        max-width: 375px !important;
      }
    `;
    shadow.appendChild(style);
    
    // 4. Carica i font esplicitamente per assicurare compatibilità Shadow DOM
    const fontUrls = [
      '/fonts/PeugeotNew-ExtraLight.ttf',
      '/fonts/PeugeotNew-Light.ttf', 
      '/fonts/PeugeotNew-Regular.ttf',
      '/fonts/PeugeotNew-Italic.ttf',
      '/fonts/PeugeotNew-Bold.ttf',
      '/fonts/PeugeotNew-BoldItalic.ttf',
      '/fonts/PeugeotNew-Black.ttf',
      '/fonts/PeugeotNew-BlackItalic.ttf'
    ];
    
    const fontWeights = [200, 300, 400, 400, 700, 700, 900, 900];
    const fontStyles = ['normal', 'normal', 'normal', 'italic', 'normal', 'italic', 'normal', 'italic'];
    
    // Carica i font usando Font Loading API
    const fontPromises = fontUrls.map((url, index) => {
      const fontFace = new FontFace(
        'PeugeotNew', 
        `url(${url})`,
        {
          weight: fontWeights[index],
          style: fontStyles[index]
        }
      );
      
      return fontFace.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        return loadedFont;
      }).catch(() => null);
    });
    
    // Aspetta il caricamento dei font
    await Promise.all(fontPromises);
    console.log('🔤 Fonts loaded successfully');

    // 5. Crea il nodo root per Vue
    const appRoot = document.createElement('div');
    appRoot.id = 'peugeot-widget-app';
    shadow.appendChild(appRoot);

    // 6. Monta Vue app
    const app = createApp(ChatWindow);
    
    // Passa la config come global property
    app.config.globalProperties.$widgetConfig = config;
    
    // Error handler per debug
    app.config.errorHandler = (err, vm, info) => {
      console.error('🚨 Vue Error:', err, info);
    };
    
    app.mount(appRoot);
    console.log('✅ Peugeot Chat Widget successfully mounted');

  } catch (error) {
    console.error('💥 Error mounting widget:', error);
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
    console.log('📄 DOM loaded, waiting for manual init...');
  });
} else {
  console.log('📄 DOM already loaded, waiting for manual init...');
}

console.log('📝 Peugeot Chat Widget script loaded');
