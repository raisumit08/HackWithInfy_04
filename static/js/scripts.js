// Chatbot functionality
function toggleChat() {
    const chatbot = document.getElementById('chatbot');
    if (chatbot) {
        chatbot.classList.toggle('open');
    }
}

function sendMessage() {
    const userInput = document.getElementById('user-message');
    if (userInput) {
        const message = userInput.value.trim();
        
        if (message) {
            addMessageToChat('user', message);
            userInput.value = '';
            
            // Simulate bot response (replace with actual API call in a real application)
            setTimeout(() => {
                const botResponse = getBotResponse(message);
                addMessageToChat('bot', botResponse);
            }, 1000);
        }
    }
}

function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function getBotResponse(message) {
    // This is a simple example. In a real application, you'd integrate with a proper chatbot API.
    const responses = {
        'hello': 'Hi there! How can I assist you with your health today?',
        'how are you': 'I\'m an AI assistant, so I don\'t have feelings, but I\'m functioning well. How can I help you?',
        'bye': 'Goodbye! Take care of your health!',
    };
    
    message = message.toLowerCase();
    for (const key in responses) {
        if (message.includes(key)) {
            return responses[key];
        }
    }
    
    return "I'm sorry, I didn't understand that. Can you please rephrase or ask a health-related question?";
}

// Initialize chatbot
document.addEventListener('DOMContentLoaded', function() {
    // Add initial bot message
    addMessageToChat('bot', 'Hello! I\'m your health assistant. How can I help you today?');
});
