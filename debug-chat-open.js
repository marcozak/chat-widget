// SCRIPT PER DIAGNOSTICARE LA CHAT QUANDO È APERTA
// Incolla questo nel console del browser SOLO quando la chat è aperta e visibile

console.log("=== DIAGNOSI CHAT APERTA ===");

// 1. Cerca i fumetti dei messaggi bot (blu)
const botMessages = document.querySelectorAll('.peugeot-widget [class*="bg-blue"]:not(.h-\\[410px\\])');
console.log("Fumetti bot trovati:", botMessages.length);
botMessages.forEach((msg, i) => {
    const style = window.getComputedStyle(msg);
    console.log(`Bot message ${i}:`, {
        classList: Array.from(msg.classList),
        fontSize: style.fontSize,
        padding: style.padding,
        margin: style.margin,
        width: style.width,
        minWidth: style.minWidth
    });
});

// 2. Cerca i fumetti dei messaggi utente (bianchi)
const userMessages = document.querySelectorAll('.peugeot-widget [class*="bg-white"]:not(.rounded-full)');
console.log("Fumetti utente trovati:", userMessages.length);
userMessages.forEach((msg, i) => {
    const style = window.getComputedStyle(msg);
    console.log(`User message ${i}:`, {
        classList: Array.from(msg.classList),
        fontSize: style.fontSize,
        padding: style.padding,
        margin: style.margin,
        width: style.width,
        minWidth: style.minWidth
    });
});

// 3. Cerca i bottoni proposal (suggerimenti)
const proposalButtons = document.querySelectorAll('.peugeot-widget [class*="border"][class*="rounded-full"]:not(.bg-white)');
console.log("Bottoni proposal trovati:", proposalButtons.length);
proposalButtons.forEach((btn, i) => {
    const style = window.getComputedStyle(btn);
    console.log(`Proposal button ${i}:`, {
        classList: Array.from(btn.classList),
        fontSize: style.fontSize,
        padding: style.padding,
        margin: style.margin,
        text: btn.textContent?.trim()
    });
});

// 4. Cerca l'input di testo
const chatInput = document.querySelector('.peugeot-widget input[type="text"]');
if (chatInput) {
    const style = window.getComputedStyle(chatInput);
    console.log("Chat input:", {
        classList: Array.from(chatInput.classList),
        fontSize: style.fontSize,
        padding: style.padding,
        height: style.height
    });
}

// 5. Cerca il container della chat
const chatContainer = document.querySelector('.peugeot-widget [class*="h-\\[90px\\]"]');
if (chatContainer) {
    const style = window.getComputedStyle(chatContainer);
    console.log("Chat container:", {
        classList: Array.from(chatContainer.classList),
        padding: style.padding,
        height: style.height
    });
}

// 6. Trova tutti gli elementi con testo visibile nella chat
const allTextElements = document.querySelectorAll('.peugeot-widget *');
const textElements = Array.from(allTextElements).filter(el => {
    const rect = el.getBoundingClientRect();
    const hasText = el.textContent && el.textContent.trim().length > 0;
    const isVisible = rect.width > 0 && rect.height > 0;
    const isInChatArea = rect.top > window.innerHeight * 0.3; // Parte bassa dello schermo
    return hasText && isVisible && isInChatArea && !el.querySelector('*'); // Solo foglie
});

console.log("Elementi di testo nella chat:", textElements.length);
textElements.forEach((el, i) => {
    const style = window.getComputedStyle(el);
    console.log(`Text element ${i}:`, {
        text: el.textContent.trim().substring(0, 30) + "...",
        classList: Array.from(el.classList),
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        tagName: el.tagName
    });
});

console.log("=== FINE DIAGNOSI ===");
