// SCRIPT PER VEDERE LE CLASSI ESATTE DEGLI ELEMENTI CHAT
console.log("=== CLASSI ESATTE CHAT ===");

// Bot messages
const botMessages = document.querySelectorAll('.peugeot-widget [class*="bg-blue"]:not(.h-\\[410px\\])');
console.log("Bot messages:");
botMessages.forEach((msg, i) => {
    console.log(`Bot ${i}: "${msg.className}"`);
});

// User messages  
const userMessages = document.querySelectorAll('.peugeot-widget [class*="bg-white"]:not(.rounded-full)');
console.log("User messages:");
userMessages.forEach((msg, i) => {
    console.log(`User ${i}: "${msg.className}"`);
});

// Proposal buttons
const proposalButtons = document.querySelectorAll('.peugeot-widget [class*="border"][class*="rounded-full"]:not(.bg-white)');
console.log("Proposal buttons:");
proposalButtons.forEach((btn, i) => {
    console.log(`Proposal ${i}: "${btn.className}"`);
});

// Chat input
const chatInput = document.querySelector('.peugeot-widget input[type="text"]');
if (chatInput) {
    console.log(`Chat input: "${chatInput.className}"`);
}

// Chat container
const chatContainer = document.querySelector('.peugeot-widget [class*="h-\\[90px\\]"]');
if (chatContainer) {
    console.log(`Chat container: "${chatContainer.className}"`);
}

// CTA button
const ctaButton = document.querySelector('.peugeot-widget [class*="bg-gray-dark"]');
if (ctaButton) {
    console.log(`CTA button: "${ctaButton.className}"`);
}

console.log("=== FINE CLASSI ===");
