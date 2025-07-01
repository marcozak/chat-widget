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
    
    // STRATEGIA CORRETTA: Usa sempre il CSS inline completo
    // Il CSS inline contiene tutte le classi Tailwind necessarie (~261kB completo)
    // Il CSS bundle di produzione è solo ~8kB e contiene solo Swiper (incompleto)
    console.log('� Using complete inline CSS (contains all Tailwind classes)');
    console.log('� Shadow CSS length:', shadowCss.length);
    console.log('📊 Tailwind CSS length:', tailwindCss.length);
    const allCss = tailwindCss + '\n\n' + shadowCss;
    
    console.log('📊 Combined CSS length:', allCss.length);
    console.log('📊 CSS contains .flex:', allCss.includes('.flex'));
    console.log('📊 CSS contains .bg-black:', allCss.includes('.bg-black'));
    console.log('📊 CSS contains PeugeotNew:', allCss.includes('PeugeotNew'));
    
    const style = document.createElement('style');
    
    // STRATEGIA ALTERNATIVA: Forziamo SOLO le regole critiche con !important
    // NON tutte le regole, solo quelle che servono per contrastare il CSS ostile
    let forcedCss = allCss
      // Forza SOLO font-size e font-family per contrastare il CSS ostile
      .replace(/font-family:\s*([^;]+);/g, 'font-family: $1 !important;')
      .replace(/font-size:\s*([^;]+);/g, 'font-size: $1 !important;')
      // FIX CRITICO: Sostituisci unità viewport che non funzionano in Shadow DOM
      .replace(/100vw/g, '375px')
      .replace(/100vh/g, '640px')
      .replace(/(\d+)vw/g, function(match, p1) { return Math.round(p1 * 3.75) + 'px'; })  // Converte vw in px
      .replace(/(\d+)vh/g, function(match, p1) { return Math.round(p1 * 6.4) + 'px'; });   // Converte vh in px
    
    console.log('🔧 CSS Transformation Debug:');
    console.log('  - Original combined CSS length:', allCss.length);
    console.log('  - Forced CSS length:', forcedCss.length);
    console.log('  - Added !important rules:', forcedCss.length - allCss.length);
    console.log('  - Contains !important font-family:', forcedCss.includes('font-family:') && forcedCss.includes('!important'));
    console.log('  - Converted viewport units:', !forcedCss.includes('vw') && !forcedCss.includes('vh'));
    console.log('  - Original contained 100vw:', allCss.includes('100vw'));
    console.log('  - Original contained 100vh:', allCss.includes('100vh'));
    console.log('  - Contains Tailwind base:', forcedCss.includes('.flex'));
    console.log('  - Contains @tailwind directives:', forcedCss.includes('@tailwind'));
    
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
      }
      
      /* Reset selettivo - NON cancellare tutto */
      body, html, input, button, div, p, span, a {
        font-size: inherit !important;
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
      
      /* FIX SPECIFICO per classi Tailwind problematiche */
      .w-screen {
        width: 375px !important;  /* Dimensione mobile fissa invece di 100vw */
      }
      
      .h-dynamic {
        height: 640px !important;  /* Dimensione fissa invece di viewport */
      }
      
      /* Override per max-height viewport */
      [style*="max-height: 100vh"] {
        max-height: 640px !important;
      }
      
      /* Assicura che il container principale sia di dimensioni corrette */
      .md\\:w-\\[375px\\] {
        width: 375px !important;
      }
      
      .md\\:h-\\[640px\\] {
        height: 640px !important;
      }
      
      /* OVERRIDE BRUTALE per dimensioni del widget */
      [data-v-443d312e].w-screen {
        width: 375px !important;
        max-width: 375px !important;
      }
      
      [data-v-443d312e].h-dynamic {
        height: 640px !important;
        max-height: 640px !important;
      }
      
      /* Fix per l'icona gigante - limitiamo le dimensioni di SVG e immagini */
      [data-v-443d312e] svg {
        width: auto !important;
        height: auto !important;
        max-width: 50px !important;
        max-height: 50px !important;
      }
      
      [data-v-443d312e] img {
        width: auto !important;
        height: auto !important;
        max-width: 50px !important;
        max-height: 50px !important;
      }
      
      /* Fix per il bottone rotondo del widget */
      [data-v-443d312e] .w-16 {
        width: 64px !important;
        max-width: 64px !important;
      }
      
      [data-v-443d312e] .h-16 {
        height: 64px !important;
        max-height: 64px !important;
      }
      
      [data-v-443d312e] .w-20 {
        width: 80px !important;
        max-width: 80px !important;
      }
      
      [data-v-443d312e] .h-20 {
        height: 80px !important;
        max-height: 80px !important;
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
          console.log('    - Font size:', computedStyle.fontSize);
          console.log('    - Font weight:', computedStyle.fontWeight);
          console.log('    - Width:', computedStyle.width);
          console.log('    - Height:', computedStyle.height);
          console.log('    - Border radius:', computedStyle.borderRadius);
          console.log('    - Position:', computedStyle.position);
          console.log('    - Bottom:', computedStyle.bottom);
          console.log('    - Right:', computedStyle.right);
          console.log('    - Z-index:', computedStyle.zIndex);
        }
        
        // Debug specifico per elementi con background nero
        const blackBgElements = appContent.querySelectorAll('.bg-black, [class*="bg-black"]');
        console.log('  - Black background elements found:', blackBgElements.length);
        blackBgElements.forEach((el, i) => {
          const style = getComputedStyle(el);
          console.log(`    - Black bg element ${i}:`, {
            classes: el.className,
            computedBg: style.backgroundColor,
            computedColor: style.color,
            width: style.width,
            height: style.height
          });
        });
        
        // Debug per tutti gli elementi con classi bg-*
        const allBgElements = appContent.querySelectorAll('[class*="bg-"]');
        console.log('  - All background elements found:', allBgElements.length);
        allBgElements.forEach((el, i) => {
          const style = getComputedStyle(el);
          const bgClasses = el.className.split(' ').filter(c => c.startsWith('bg-'));
          if (bgClasses.length > 0) {
            console.log(`    - Bg element ${i}:`, {
              bgClasses: bgClasses,
              computedBg: style.backgroundColor,
              element: el.tagName
            });
          }
        });
        
        // Debug per font issues
        const fontElements = appContent.querySelectorAll('.font-PeugeotNew, [class*="font-"]');
        console.log('  - Font elements found:', fontElements.length);
        fontElements.forEach((el, i) => {
          const style = getComputedStyle(el);
          console.log(`    - Font element ${i}:`, {
            classes: el.className.split(' ').filter(c => c.includes('font')),
            computedFont: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight
          });
        });
        
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
