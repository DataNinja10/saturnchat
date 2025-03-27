const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const usernameInput = document.getElementById('username');

// Fetch messages from the server
async function fetchMessages() {
    const response = await fetch('/.netlify/functions/getMessages');
    const messages = await response.json();
    
    chatContainer.innerHTML = '';
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <strong>${msg.sender}:</strong> ${msg.text}
            <small>${new Date(msg.timestamp).toLocaleTimeString()}</small>
        `;
        chatContainer.appendChild(messageElement);
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send a new message
async function sendMessage() {
    const text = messageInput.value.trim();
    const sender = usernameInput.value.trim() || 'Anonymous';
    
    if (text) {
        await fetch('/.netlify/functions/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender, text }),
        });
        messageInput.value = '';
        fetchMessages();
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Fetch messages every 2 seconds
fetchMessages();
setInterval(fetchMessages, 2000);
