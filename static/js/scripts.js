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
                    contentArea.innerHTML = `<p class="text-red-500">Error: ${data.error}</p>`;
                } else {
                    contentArea.innerHTML = data.content;
                    if (section) {
                        const element = document.getElementById(section);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                    history.pushState(null, '', `/${page}${section ? '#' + section : ''}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                contentArea.innerHTML = '<p class="text-red-500">An error occurred while loading the content.</p>';
            });
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const [page, section] = location.pathname.substr(1).split('#');
        loadContent(page || 'dashboard', section);
    });

    // Load initial content
    loadContent('dashboard');

    // Chatbot functionality
    const chatbot = document.getElementById('chatbot');
    const chatMessages = document.getElementById('chat-messages');
    const chatToggle = document.querySelector('.chat-toggle');
    const chatInput = document.querySelector('.chat-input');
    const userMessageInput = document.getElementById('user-message');
    const sendButton = document.getElementById('send-button');

    chatMessages.classList.add('h-64', 'max-h-64', 'overflow-y-auto');
    addMessageToChat('bot', "Hello! I'm your health assistant powered by Gemini. How can I help you today?");

    chatToggle.addEventListener('click', toggleChat);
    sendButton.addEventListener('click', sendMessage);
    userMessageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function toggleChat() {
        chatbot.classList.toggle('h-auto');
        chatbot.classList.toggle('h-16');
        chatMessages.classList.toggle('hidden');
        chatInput.classList.toggle('hidden');
    }

    async function sendMessage() {
        const message = userMessageInput.value.trim();
        
        if (message) {
            addMessageToChat('user', message);
            userMessageInput.value = '';
            
            try {
                const response = await getGeminiResponse(message);
                const formattedResponse = formatResponse(response);
                addMessageToChat('bot', formattedResponse);
            } catch (error) {
                console.error('Error:', error);
                addMessageToChat('bot', "I'm sorry, I encountered an error. Please try again later.");
            }
        }
    }

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('mb-2', 'p-2', 'rounded');
        
        if (sender === 'user') {
            messageElement.classList.add('bg-blue-100', 'text-right');
        } else {
            messageElement.classList.add('bg-gray-100', 'text-left');
        }
        
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function getGeminiResponse(message) {
        const API_KEY = 'AIzaSyDcMmRQJoheKn-qM7HZ5yRRFEk65Kz8_og';
        const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to get response from Gemini API');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    function formatResponse(response) {
        return response.replace(/[\[\]{}'"`]/g, '').trim();
    }
});