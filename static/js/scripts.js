document.addEventListener('DOMContentLoaded', function() {
    const contentArea = document.getElementById('content-area');
    const links = document.querySelectorAll('nav a, .sidebar a');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('href').split('#')[0].substr(1);
            const section = this.getAttribute('href').split('#')[1];
            loadContent(page, section);
        });
    });

    function loadContent(page, section = null) {
        fetch(`/api/${page}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    contentArea.innerHTML = `<p>Error: ${data.error}</p>`;
                } else {
                    contentArea.innerHTML = data.content;
                    if (section) {
                        const element = document.getElementById(section);
                        if (element) {
                            element.scrollIntoView();
                        }
                    }
                    history.pushState(null, '', `/${page}${section ? '#' + section : ''}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                contentArea.innerHTML = '<p>An error occurred while loading the content.</p>';
            });
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const [page, section] = location.pathname.substr(1).split('#');
        loadContent(page || 'dashboard', section);
    });

    // Load initial content
    loadContent('dashboard');
});

function toggleChat() {
    const chatbot = document.getElementById('chatbot');
    chatbot.classList.toggle('open');
}

function sendMessage() {
    const userInput = document.getElementById('user-message');
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

function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(message) {
    // This is a simple example. In a real application, you'd integrate with a proper chatbot API.
    const responses = {
        'hello': 'Hi there! How can I assist you with your health today?',
        'how are you': "I'm an AI assistant, so I don't have feelings, but I'm functioning well. How can I help you?",
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
    // ... (previous code remains the same) ...

    // Add initial bot message
    addMessageToChat('bot', "Hello! I'm your health assistant. How can I help you today?");
});


function toggleChat() {
    const chatbot = document.getElementById('chatbot');
    chatbot.classList.toggle('open');
}

function sendMessage() {
    const userMessage = document.getElementById('user-message').value;
    const chatMessages = document.getElementById('chat-messages');

    if (userMessage.trim() !== '') {
        const messageElement = document.createElement('div');
        messageElement.textContent = `You: ${userMessage}`;
        chatMessages.appendChild(messageElement);
        document.getElementById('user-message').value = '';
    }
}