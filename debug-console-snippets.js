// SNIPPET PER DEBUG CONSOLE - COPIA E INCOLLA NELLA CONSOLE DEL BROWSER

// 0. DEBUG CONFLITTI WIDGET
console.log("=== WIDGET CONFLICT DEBUG ===");
const allChatRoots = document.querySelectorAll('#chat-root, [id*="chat"], [class*="chat"]');
console.log('All chat-related elements:', allChatRoots.length);
allChatRoots.forEach((el, i) => {
  console.log(`Chat element ${i}:`, {
    id: el.id,
    classes: el.className,
    hasShadow: !!el.shadowRoot,
    children: el.children.length,
    innerHTML: el.innerHTML.substring(0, 100) + '...'
  });
});

// Verifica script duplicati
const allScripts = Array.from(document.querySelectorAll('script')).filter(s => 
  s.src && (s.src.includes('chat-widget') || s.src.includes('peugeot'))
);
console.log('Widget scripts found:', allScripts.length);
allScripts.forEach((script, i) => {
  console.log(`Script ${i}:`, script.src);
});

// 1. DEBUG SHADOW DOM VERSION
console.log("=== SHADOW DOM DEBUG ===");
const shadowHost = document.querySelector('#chat-root');
const shadow = shadowHost?.shadowRoot;
console.log('Shadow host found:', !!shadowHost);
console.log('Shadow root found:', !!shadow);

if (shadowHost && !shadow) {
  console.log('Chat-root exists but has no shadow DOM - checking if it contains normal content...');
  const chatRootContent = shadowHost.querySelector('*');
  console.log('Chat-root has content:', !!chatRootContent);
  if (chatRootContent) {
    console.log('Chat-root children:', shadowHost.children.length);
    Array.from(shadowHost.children).forEach((child, i) => {
      console.log(`Chat-root child ${i}:`, child.tagName, child.id, child.className);
    });
  }
}

// Prova vari selettori per trovare l'app
const shadowApp = shadow?.querySelector('#peugeot-widget-app') || 
                  shadow?.querySelector('[data-v-app]') ||
                  shadow?.querySelector('div') ||
                  shadow?.firstElementChild;

console.log('Shadow app found:', !!shadowApp);
if (shadowApp) {
  console.log('Shadow app element:', shadowApp.tagName, shadowApp.id, shadowApp.className);
}

if (shadowApp) {
  // Tutti gli elementi con classi Tailwind
  const allElements = shadowApp.querySelectorAll('*');
  console.log('Total elements in shadow:', allElements.length);
  
  // Background elements
  const bgElements = shadowApp.querySelectorAll('[class*="bg-"]');
  console.log('Background elements:', bgElements.length);
  bgElements.forEach((el, i) => {
    const style = getComputedStyle(el);
    const className = el.className || '';
    const bgClasses = className.toString().split(' ').filter(c => c.startsWith('bg-'));
    console.log(`Shadow bg-${i}:`, {
      element: el.tagName,
      classes: bgClasses,
      computedBg: style.backgroundColor,
      rect: el.getBoundingClientRect()
    });
  });
  
  // Font elements
  const fontElements = shadowApp.querySelectorAll('[class*="font-"], .text-white, .text-gray-900');
  console.log('Font/text elements:', fontElements.length);
  fontElements.forEach((el, i) => {
    const style = getComputedStyle(el);
    console.log(`Shadow font-${i}:`, {
      element: el.tagName,
      textContent: el.textContent?.substring(0, 20) + '...',
      computedFont: style.fontFamily,
      fontSize: style.fontSize,
      color: style.color
    });
  });
  
  // Position elements (fixed, absolute)
  const posElements = shadowApp.querySelectorAll('.fixed, .absolute, [class*="bottom-"], [class*="right-"]');
  console.log('Positioned elements:', posElements.length);
  posElements.forEach((el, i) => {
    const style = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    console.log(`Shadow pos-${i}:`, {
      element: el.tagName,
      position: style.position,
      bottom: style.bottom,
      right: style.right,
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      isVisible: rect.width > 0 && rect.height > 0 && rect.x >= 0 && rect.y >= 0
    });
  });
} else {
  console.log('Shadow DOM app not found - checking shadow content...');
  if (shadow) {
    console.log('Shadow children:', shadow.children.length);
    Array.from(shadow.children).forEach((child, i) => {
      console.log(`Shadow child ${i}:`, child.tagName, child.id, child.className);
    });
  }
}

// 2. DEBUG NORMAL DOM VERSION (se presente)
console.log("\n=== NORMAL DOM DEBUG ===");
// Cerca in tutto il documento per la versione normale
const normalApp = document.querySelector('#app') || 
                  document.querySelector('.chat-widget') ||
                  document.querySelector('[data-v-443d312e]') ||
                  document.querySelector('[data-v-bcbeacbb]') ||
                  document.querySelector('[data-v-]') ||
                  document.querySelector('#chat-root:not([shadowroot])');

console.log('Normal DOM search results:');
console.log('  - #app:', !!document.querySelector('#app'));
console.log('  - .chat-widget:', !!document.querySelector('.chat-widget'));
console.log('  - [data-v-443d312e]:', !!document.querySelector('[data-v-443d312e]'));
console.log('  - [data-v-bcbeacbb]:', !!document.querySelector('[data-v-bcbeacbb]'));

// Cerca tutti gli attributi data-v-* presenti
const allVueElements = document.querySelectorAll('[class*="data-v-"], [data-v-]');
console.log('All Vue elements found:', allVueElements.length);
if (allVueElements.length > 0) {
  const vueIds = [...new Set(Array.from(allVueElements).map(el => {
    const attrs = Array.from(el.attributes);
    return attrs.find(attr => attr.name.startsWith('data-v-'))?.name;
  }).filter(Boolean))];
  console.log('Vue scope IDs found:', vueIds);
}

if (normalApp) {
  console.log('Normal DOM found, analyzing...', normalApp.tagName);
  // Stesso debug ma per DOM normale
  const bgElements = Array.from(document.querySelectorAll('[class*="bg-"]'));
  console.log('Normal background elements:', bgElements.length);
  bgElements.slice(0, 5).forEach((el, i) => {
    const style = getComputedStyle(el);
    const className = el.className || '';
    const bgClasses = className.toString().split(' ').filter(c => c.startsWith('bg-'));
    console.log(`Normal bg-${i}:`, {
      element: el.tagName,
      classes: bgClasses,
      computedBg: style.backgroundColor
    });
  });
} else {
  console.log('Normal DOM version not found - trying broader search...');
  // Cerca elementi con classi Tailwind direttamente nel DOM
  const tailwindElements = Array.from(document.querySelectorAll('.flex, .bg-black, .absolute, .fixed'));
  console.log('Tailwind elements in document:', tailwindElements.length);
  if (tailwindElements.length > 0) {
    console.log('Found normal DOM with Tailwind classes');
    const bgElements = Array.from(document.querySelectorAll('[class*="bg-"]'));
    console.log('Normal background elements:', bgElements.length);
    bgElements.slice(0, 5).forEach((el, i) => {
      const style = getComputedStyle(el);
      const className = el.className || '';
      const bgClasses = className.toString().split(' ').filter(c => c.startsWith('bg-'));
      console.log(`Normal bg-${i}:`, {
        element: el.tagName,
        classes: bgClasses,
        computedBg: style.backgroundColor
      });
    });
  }
}

// 3. FONT CHECK SPECIFICO
console.log("\n=== FONT DEBUG ===");
const allFontElements = [...(shadowApp?.querySelectorAll('*') || []), ...document.querySelectorAll('*')]
  .filter(el => {
    try {
      const style = getComputedStyle(el);
      const className = el.className || '';
      return style.fontFamily.includes('PeugeotNew') || className.toString().includes('font-PeugeotNew');
    } catch (e) {
      return false;
    }
  });

console.log('Elements with PeugeotNew font:', allFontElements.length);
allFontElements.slice(0, 10).forEach((el, i) => {
  const style = getComputedStyle(el);
  console.log(`Font-${i}:`, {
    element: el.tagName,
    isShadow: el.getRootNode() !== document,
    computedFont: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight
  });
});

// 4. CSS RULES CHECK
console.log("\n=== CSS RULES DEBUG ===");
if (shadow) {
  const shadowStyles = shadow.querySelectorAll('style');
  console.log('Shadow styles count:', shadowStyles.length);
  shadowStyles.forEach((style, i) => {
    const content = style.textContent;
    console.log(`Shadow style-${i}:`, {
      length: content.length,
      containsBgBlack: content.includes('.bg-black'),
      containsFontPeugeot: content.includes('PeugeotNew'),
      containsImportant: (content.match(/!important/g) || []).length
    });
  });
}

// 5. VIEWPORT ISSUE CHECK
console.log("\n=== VIEWPORT/POSITIONING DEBUG ===");
const problematicElements = [...(shadowApp?.querySelectorAll('*') || [])]
  .filter(el => {
    const rect = el.getBoundingClientRect();
    return rect.x < -10 || rect.y < -10 || rect.x > window.innerWidth + 10 || rect.y > window.innerHeight + 10;
  });

console.log('Elements outside viewport:', problematicElements.length);
problematicElements.forEach((el, i) => {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const className = el.className || '';
  console.log(`Outside-${i}:`, {
    element: el.tagName,
    classes: className.toString(),
    rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    position: style.position,
    transform: style.transform
  });
});

// 7. MISSING TAILWIND CLASSES DEBUG
console.log("\n=== MISSING TAILWIND CLASSES ===");

// Classi che dovrebbero essere presenti
const expectedClasses = [
  'bg-black', 'bg-white', 'bg-blue', 'bg-gray-900', 'bg-gradient-to-b',
  'text-white', 'text-gray-900', 'text-xs', 'text-sm',
  'rounded-full', 'rounded-t-2xl', 'rounded-b-2xl',
  'w-16', 'h-16', 'w-20', 'h-20', 'w-screen', 'h-dynamic',
  'flex', 'flex-col', 'justify-center', 'items-center',
  'fixed', 'absolute', 'bottom-3', 'right-4'
];

const missingClasses = [];
const presentClasses = [];

expectedClasses.forEach(className => {
  const elements = [...(shadowApp?.querySelectorAll(`.${className}`) || []), ...document.querySelectorAll(`.${className}`)];
  if (elements.length > 0) {
    presentClasses.push({ className, count: elements.length });
  } else {
    missingClasses.push(className);
  }
});

console.log('Present classes:', presentClasses);
console.log('Missing classes:', missingClasses);

// Test specifico per colori
const colorElements = [...(shadowApp?.querySelectorAll('[class*="bg-"], [class*="text-"]') || [])];
console.log('Color elements found:', colorElements.length);
colorElements.slice(0, 10).forEach((el, i) => {
  const style = getComputedStyle(el);
  const className = el.className || '';
  const colorClasses = className.toString().split(' ').filter(c => c.startsWith('bg-') || c.startsWith('text-'));
  console.log(`Color-${i}:`, {
    element: el.tagName,
    colorClasses,
    computedBg: style.backgroundColor,
    computedColor: style.color
  });
});

// DEBUG SPECIFICO PER IL BOTTONE BLU PROBLEMATICO
console.log("\n=== BOTTONE BLU DEBUG ===");
const blueGrayButtons = [...(shadowApp?.querySelectorAll('.bg-blue-gray') || [])];
console.log('Bottoni bg-blue-gray trovati:', blueGrayButtons.length);
blueGrayButtons.forEach((btn, i) => {
  const style = getComputedStyle(btn);
  const innerCircle = btn.querySelector('.bg-blue');
  const innerCircleStyle = innerCircle ? getComputedStyle(innerCircle) : null;
  
  console.log(`Bottone bg-blue-gray ${i}:`, {
    classes: btn.className,
    computedBg: style.backgroundColor,
    opacity: style.opacity,
    visibility: style.visibility,
    display: style.display,
    innerCircle: !!innerCircle,
    innerCircleBg: innerCircleStyle?.backgroundColor,
    innerCircleOpacity: innerCircleStyle?.opacity
  });
});

// 8. SVG DEBUG SPECIFICO - per le "box bianche semi-trasparenti"
console.log("\n=== SVG DEBUG (Box bianche) ===");
const allSvgs = [...(shadowApp?.querySelectorAll('svg') || [])];
console.log('SVG elements found:', allSvgs.length);
allSvgs.forEach((svg, i) => {
  const style = getComputedStyle(svg);
  const parent = svg.parentElement;
  const parentStyle = parent ? getComputedStyle(parent) : null;
  console.log(`SVG-${i}:`, {
    element: svg.tagName,
    parent: parent?.tagName,
    parentClasses: parent?.className,
    svgBg: style.backgroundColor,
    svgFill: style.fill,
    svgStroke: style.stroke,
    parentBg: parentStyle?.backgroundColor,
    parentClasses: parent?.className,
    hasWhiteBg: style.backgroundColor === 'rgb(255, 255, 255)' || parentStyle?.backgroundColor === 'rgb(255, 255, 255)',
    rect: svg.getBoundingClientRect()
  });
});

// Debug per button con SVG (probabile causa delle box bianche)
const buttonsWithSvg = [...(shadowApp?.querySelectorAll('button') || [])].filter(btn => btn.querySelector('svg'));
console.log('Buttons with SVG found:', buttonsWithSvg.length);
buttonsWithSvg.forEach((btn, i) => {
  const style = getComputedStyle(btn);
  const svg = btn.querySelector('svg');
  const svgStyle = svg ? getComputedStyle(svg) : null;
  console.log(`Button+SVG-${i}:`, {
    buttonClasses: btn.className,
    buttonBg: style.backgroundColor,
    buttonBorder: style.border,
    buttonOpacity: style.opacity,
    svgFill: svgStyle?.fill,
    svgStroke: svgStyle?.stroke,
    svgBg: svgStyle?.backgroundColor,
    hasWhiteBg: style.backgroundColor === 'rgb(255, 255, 255)',
    hasWhiteOverlay: style.backgroundColor.includes('255, 255, 255') && style.opacity !== '1'
  });
});

// Debug specifico per icone (X, back arrow, menu)
const iconElements = [...(shadowApp?.querySelectorAll('[class*="icon"], .cursor-pointer svg, button svg') || [])];
console.log('Icon elements found:', iconElements.length);
iconElements.slice(0, 10).forEach((icon, i) => {
  const style = getComputedStyle(icon);
  const parent = icon.parentElement;
  const parentStyle = parent ? getComputedStyle(parent) : null;
  console.log(`Icon-${i}:`, {
    element: icon.tagName,
    classes: icon.className || parent?.className,
    fill: style.fill,
    stroke: style.stroke,
    bg: style.backgroundColor,
    parentBg: parentStyle?.backgroundColor,
    opacity: style.opacity,
    parentOpacity: parentStyle?.opacity
  });
});
