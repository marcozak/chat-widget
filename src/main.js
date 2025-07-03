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
    
    // 🔍 DEBUG SPECIFICO PER I FONT
    console.log('🔍 FONT DEBUG:');
    console.log('  - CSS contains @font-face:', allCss.includes('@font-face'));
    console.log('  - CSS contains font-family PeugeotNew:', allCss.includes('font-family: PeugeotNew'));
    console.log('  - CSS contains .font-PeugeotNew class:', allCss.includes('.font-PeugeotNew'));
    console.log('  - CSS contains .font-PeugeotNewBold class:', allCss.includes('.font-PeugeotNewBold'));
    
    // Conta quante @font-face rules ci sono
    const fontFaceMatches = allCss.match(/@font-face/g);
    console.log('  - Number of @font-face rules:', fontFaceMatches ? fontFaceMatches.length : 0);
    
    // Verifica i path dei font
    const fontUrlMatches = allCss.match(/url\(([^)]+\.ttf)\)/g);
    console.log('  - Font URLs found:', fontUrlMatches ? fontUrlMatches.length : 0);
    if (fontUrlMatches) {
      fontUrlMatches.forEach((url, index) => {
        console.log(`    Font ${index + 1}: ${url}`);
        
        // Test se il font è accessibile (solo per il primo per non spammare)
        if (index === 0) {
          const fontPath = url.replace(/url\(([^)]+)\)/, '$1');
          console.log(`    Testing font accessibility: ${fontPath}`);
          
          // Prova a caricare il font per testare se è accessibile
          fetch(fontPath)
            .then(response => {
              if (response.ok) {
                console.log(`    ✅ Font accessible: ${fontPath} (${response.status})`);
              } else {
                console.log(`    ❌ Font not accessible: ${fontPath} (${response.status})`);
              }
            })
            .catch(error => {
              console.log(`    ❌ Font fetch error: ${fontPath} - ${error.message}`);
            });
        }
      });
    }
    
    const style = document.createElement('style');
    
    // STRATEGIA ALTERNATIVA: Forziamo SOLO le regole critiche con !important
    // NON tutte le regole, solo quelle che servono per contrastare il CSS ostile
    let forcedCss = allCss
      // Forza SOLO font-family per contrastare il CSS ostile, MA NON font-size
      //.replace(/font-family:\s*([^;]+);/g, 'font-family: $1 !important;')
      // NON forzare font-size globalmente - mantieni i font piccoli
      // .replace(/font-size:\s*([^;]+);/g, 'font-size: $1 !important;')
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
      /* RESET MINIMALE PER SHADOW DOM - SOLO ESSENZIALE */
      :host {
        all: initial !important;
        display: block !important;
        background: transparent !important;
      }
      
      * {
        box-sizing: border-box !important;
      }
      
      /* CSS DEL WIDGET (con conversione unità viewport) */
      ${forcedCss}
      
      /* FIX VIEWPORT UNITS - Solo classi che potrebbero usare unità viewport problematiche */
      .w-screen {
        width: 375px !important;  /* Dimensione mobile fissa invece di 100vw */
      }
      
      /* Override per max-height viewport solo se necessario */
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
      
      /* Fix per l'icona gigante - limitiamo le dimensioni di SVG e immagini 
      [data-v-443d312e] svg {
        width: auto !important;
        height: auto !important;
        max-width: 50px !important;
        max-height: 50px !important;
        background: transparent !important;
      }*/
      
      [data-v-443d312e] img {
        width: auto !important;
        height: auto !important;
        max-width: 50px !important;
        max-height: 50px !important;
        background: transparent !important;
      }
      
      /* FIX SPECIFICO per bottone X - NESSUN BACKGROUND 
      [data-v-443d312e] button.z-20.relative {
        background: transparent !important;
        background-color: transparent !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
        outline: none !important;
      }*/
      
      /* FIX SPECIFICO per button SVG (NON tutti i button) 
      [data-v-443d312e] button.z-20.relative,
      [data-v-443d312e] button.flex.items-center {
        background: transparent !important;
        background-color: transparent !important;
        border: none !important;
      }
     [data-v-443d312e] button.flex.items-center {
        border: none !important;
      }*/
      
      /* FIX CRITICO: SVG con background bianco semi-trasparente 
      svg {
        background: none !important;
        background-color: transparent !important;
        fill: currentColor !important;
      }*/
      
      /* FIX per icone con box bianche 
      .bg-white svg {
        background: none !important;
        fill: currentColor !important;
      }*/
      
      /* FIX specifico per button con SVG (X, back arrow, menu) 
      button svg {
        background: transparent !important;
        background-color: transparent !important;
        fill: currentColor !important;
        stroke: currentColor !important;
      }*/
      
      /* FIX per elementi cursor-pointer con SVG 
      .cursor-pointer svg {
        background: transparent !important;
        fill: currentColor !important;
      }*/
      
      /* FIX per button absolute/fixed (widget button, back button, close button)
      .absolute svg,
      .fixed svg {
        background: transparent !important;
        fill: currentColor !important;
      } */
      
      /* FIX per carousel fuori viewport - forza dimensioni del contenitore */
      swiper-container,
      swiper-slide {
        max-width: 375px !important;
        overflow: hidden !important;
      }
      
      /* FIX specifico per elementi Swiper fuori viewport */
      .swiper-wrapper {
        transform: none !important;
        max-width: 375px !important;
      }
      
      .h-\\[480px\\] {
        max-height: 480px !important;
        overflow: hidden !important;
      }
      
      /* Fix per il bottone rotondo del widget 
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
      }*/
      
      /* FIX COLORI - Forza i colori corretti 
      .bg-gray-dark {
        background-color: rgb(55, 65, 81) !important;
      }
      
      .bg-blue {
        background-color: rgb(0, 102, 204) !important;
      }
      
      .bg-blue-gray {
        background-color: rgb(68, 92, 130) !important;
      }*/
      
      .bg-gray-900 {
        background-color: rgb(17, 24, 39) !important;
      }
      
      .text-gray-900 {
        color: rgb(17, 24, 39) !important;
      }
      
      /* 🔄 FORZA IL RENDERING DEI FONT - Trucchi CSS per forzare il browser */
      .font-PeugeotNew, .font-PeugeotNewBold {
        font-display: swap !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
      }
      
      /* Forza il re-render con animation */
      @keyframes fontForceRender {
        0% { opacity: 0.99; }
        100% { opacity: 1; }
      }
      
      .font-PeugeotNew, .font-PeugeotNewBold {
        animation: fontForceRender 0.01s ease-in-out !important;
      }
    `;
    shadow.appendChild(style);
    console.log('🎨 CSS injected with browser defaults + our styles');
    
    // 🚀 CARICAMENTO ESPLICITO DEI FONT NEL SHADOW DOM
    console.log('🔤 Loading fonts explicitly into Shadow DOM...');
    
    // Estrae i font URLs dal CSS
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
    
    // Carica tutti i font esplicitamente e aggiungili al documento
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
        console.log(`  ✅ Font loaded: PeugeotNew ${fontWeights[index]} ${fontStyles[index]}`);
        return loadedFont;
      }).catch((error) => {
        console.log(`  ❌ Font failed: PeugeotNew ${fontWeights[index]} ${fontStyles[index]} - ${error.message}`);
        return null;
      });
    });
    
    // Aspetta che tutti i font siano caricati
    Promise.all(fontPromises).then((results) => {
      const successful = results.filter(f => f !== null).length;
      const failed = results.filter(f => f === null).length;
      console.log(`🔤 Font loading complete: ${successful} successful, ${failed} failed`);
      
      // 🔄 FORZA IL RE-RENDER degli elementi dopo il caricamento dei font
      setTimeout(() => {
        console.log('🔄 Forcing re-render after font loading...');
        
        // Trova tutti gli elementi con font Peugeot e forza un re-render
        const elementsWithPeugeotFont = shadow.querySelectorAll('.font-PeugeotNew, .font-PeugeotNewBold, [style*="PeugeotNew"]');
        elementsWithPeugeotFont.forEach((element, index) => {
          // Trucco per forzare il re-render: modifica temporaneamente lo stile
          const originalDisplay = element.style.display;
          element.style.display = 'none';
          
          // Forza il repaint
          element.offsetHeight;
          
          // Ripristina il display
          element.style.display = originalDisplay;
          
          console.log(`  🔄 Forced re-render for element ${index + 1}`);
        });
        
        // Forza anche un repaint globale del container
        const container = shadow.querySelector('#peugeot-widget-app');
        if (container) {
          container.style.transform = 'translateZ(0)';
          setTimeout(() => {
            container.style.transform = '';
          }, 10);
        }
        
      }, 500);
    });
    
    // 🔤 CARICAMENTO ESPLICITO DEI FONT USANDO FONT LOADING API
    console.log('🔤 Loading fonts explicitly into Shadow DOM...');
    
    // Estrae i font URLs dal CSS
    const fontUrls2 = [
      '/fonts/PeugeotNew-ExtraLight.ttf',
      '/fonts/PeugeotNew-Light.ttf', 
      '/fonts/PeugeotNew-Regular.ttf',
      '/fonts/PeugeotNew-Italic.ttf',
      '/fonts/PeugeotNew-Bold.ttf',
      '/fonts/PeugeotNew-BoldItalic.ttf',
      '/fonts/PeugeotNew-Black.ttf',
      '/fonts/PeugeotNew-BlackItalic.ttf'
    ];
    
    const fontWeights2 = [200, 300, 400, 400, 700, 700, 900, 900];
    const fontStyles2 = ['normal', 'normal', 'normal', 'italic', 'normal', 'italic', 'normal', 'italic'];
    
    // Carica tutti i font esplicitamente e aggiungili al documento
    const fontPromises2 = fontUrls2.map((url, index) => {
      const fontFace = new FontFace(
        'PeugeotNew', 
        `url(${url})`,
        {
          weight: fontWeights2[index],
          style: fontStyles2[index]
        }
      );
      
      return fontFace.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        console.log(`  ✅ Font loaded: PeugeotNew ${fontWeights2[index]} ${fontStyles2[index]}`);
        return loadedFont;
      }).catch((error) => {
        console.log(`  ❌ Font failed: PeugeotNew ${fontWeights2[index]} ${fontStyles2[index]} - ${error.message}`);
        return null;
      });
    });
    
    // Aspetta che tutti i font siano caricati
    Promise.all(fontPromises2).then((results) => {
      const successful = results.filter(f => f !== null).length;
      const failed = results.filter(f => f === null).length;
      console.log(`🔤 Font loading complete: ${successful} successful, ${failed} failed`);
      
      // 🔄 FORZA IL RE-RENDER degli elementi dopo il caricamento dei font
      setTimeout(() => {
        console.log('🔄 Forcing re-render after font loading...');
        
        // Trova tutti gli elementi con font Peugeot e forza un re-render
        const elementsWithPeugeotFont = shadow.querySelectorAll('.font-PeugeotNew, .font-PeugeotNewBold, [style*="PeugeotNew"]');
        elementsWithPeugeotFont.forEach((element, index) => {
          // Trucco per forzare il re-render: modifica temporaneamente lo stile
          const originalDisplay = element.style.display;
          element.style.display = 'none';
          
          // Forza il repaint
          element.offsetHeight;
          
          // Ripristina il display
          element.style.display = originalDisplay;
          
          console.log(`  🔄 Forced re-render for element ${index + 1}`);
        });
        
        // Forza anche un repaint globale del container
        const container = shadow.querySelector('#peugeot-widget-app');
        if (container) {
          container.style.transform = 'translateZ(0)';
          setTimeout(() => {
            container.style.transform = '';
          }, 10);
        }
        
      }, 500);
    });
    
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
          console.log('    - font-family:', computedStyle.fontFamily);
          console.log('    - font-weight:', computedStyle.fontWeight);
          console.log('    - font-size:', computedStyle.fontSize);
        }
        
        // 🔍 TEST FINALE DEI FONT
        console.log('🔍 FINAL FONT TEST:');
        const elementsWithPeugeotFont = appContent.querySelectorAll('.font-PeugeotNew, .font-PeugeotNewBold');
        console.log('  - Elements with Peugeot font classes:', elementsWithPeugeotFont.length);
        
        // Test specifico per font Bold
        const boldElements = appContent.querySelectorAll('.font-PeugeotNewBold');
        console.log('  - Elements with font-PeugeotNewBold:', boldElements.length);
        
        // Debug approfondito per ogni elemento con font
        elementsWithPeugeotFont.forEach((element, index) => {
          const style = getComputedStyle(element);
          const isBold = element.classList.contains('font-PeugeotNewBold');
          console.log(`  - Element ${index + 1}:`, {
            tagName: element.tagName,
            className: element.className,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            fontSize: style.fontSize,
            isBold: isBold,
            expectedWeight: isBold ? '700' : '400',
            text: element.textContent?.substring(0, 30) + '...'
          });
          
          // Test specifico per elementi bold che non funzionano
          if (isBold && style.fontWeight !== '700') {
            console.warn(`    ⚠️ BOLD FONT ISSUE: Element has font-PeugeotNewBold but weight is ${style.fontWeight}`);
            console.log(`    📝 Element HTML:`, element.outerHTML);
            console.log(`    🎨 All computed font properties:`, {
              fontFamily: style.fontFamily,
              fontWeight: style.fontWeight,
              fontStyle: style.fontStyle,
              fontStretch: style.fontStretch,
              fontVariant: style.fontVariant,
              fontSizeAdjust: style.fontSizeAdjust
            });
          }
        });
        
        // Test font loading più specifico per bold
        if (document.fonts) {
          console.log('🔍 DETAILED FONT TEST:');
          const regularFont = document.fonts.check('400 16px PeugeotNew');
          const boldFont = document.fonts.check('700 16px PeugeotNew');
          console.log('  - PeugeotNew 400 available:', regularFont);
          console.log('  - PeugeotNew 700 available:', boldFont);
          
          // Test se il font bold è davvero nel set
          Array.from(document.fonts).forEach(font => {
            if (font.family.includes('PeugeotNew')) {
              console.log(`  - Font: ${font.family} weight:${font.weight} style:${font.style} status:${font.status}`);
            }
          });
        }
        
        // Test font loading final
        if (document.fonts) {
          const peugeotFonts = Array.from(document.fonts).filter(f => f.family.includes('Peugeot'));
          console.log('  - Peugeot fonts in document:', peugeotFonts.length);
          peugeotFonts.forEach(font => {
            console.log(`    ${font.family} ${font.weight} - Status: ${font.status}`);
          });
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
