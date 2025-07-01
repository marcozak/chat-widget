// SNIPPET PER DEBUG CONSOLE - COPIA E INCOLLA NELLA CONSOLE DEL BROWSER

// 1. DEBUG SHADOW DOM VERSION
console.log("=== SHADOW DOM DEBUG ===");
const shadowHost = document.querySelector('#chat-root');
const shadow = shadowHost?.shadowRoot;
const shadowApp = shadow?.querySelector('#peugeot-widget-app');

if (shadowApp) {
  // Tutti gli elementi con classi Tailwind
  const allElements = shadowApp.querySelectorAll('*');
  console.log('Total elements in shadow:', allElements.length);
  
  // Background elements
  const bgElements = shadowApp.querySelectorAll('[class*="bg-"]');
  console.log('Background elements:', bgElements.length);
  bgElements.forEach((el, i) => {
    const style = getComputedStyle(el);
    const bgClasses = el.className.split(' ').filter(c => c.startsWith('bg-'));
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
  console.log('Shadow DOM app not found');
}

// 2. DEBUG NORMAL DOM VERSION (se presente)
console.log("\n=== NORMAL DOM DEBUG ===");
const normalApp = document.querySelector('#app, .chat-widget, [data-v-443d312e]');
if (normalApp) {
  console.log('Normal DOM found, analyzing...');
  // Stesso debug ma per DOM normale
  const bgElements = document.querySelectorAll('[class*="bg-"]');
  console.log('Normal background elements:', bgElements.length);
  bgElements.slice(0, 5).forEach((el, i) => {
    const style = getComputedStyle(el);
    const bgClasses = el.className.split(' ').filter(c => c.startsWith('bg-'));
    console.log(`Normal bg-${i}:`, {
      element: el.tagName,
      classes: bgClasses,
      computedBg: style.backgroundColor
    });
  });
} else {
  console.log('Normal DOM version not found');
}

// 3. FONT CHECK SPECIFICO
console.log("\n=== FONT DEBUG ===");
const allFontElements = [...(shadowApp?.querySelectorAll('*') || []), ...document.querySelectorAll('*')]
  .filter(el => {
    const style = getComputedStyle(el);
    return style.fontFamily.includes('PeugeotNew') || el.className.includes('font-PeugeotNew');
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
  console.log(`Outside-${i}:`, {
    element: el.tagName,
    classes: el.className,
    rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    position: style.position,
    transform: style.transform
  });
});
