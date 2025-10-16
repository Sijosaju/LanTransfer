const socket = io();
let username = '';
let isUploading = false;

// Check if username exists in localStorage
window.onload = function() {
    const savedUsername = localStorage.getItem('lan_transfer_username');
    if (savedUsername) {
        username = savedUsername;
        document.getElementById('displayUsername').textContent = username;
        document.getElementById('userBadge').style.display = 'inline-flex';
    } else {
        showUsernameModal();
    }
};

// Show username modal
function showUsernameModal() {
    const modal = document.getElementById('usernameModal');
    modal.style.display = 'block';
    document.getElementById('usernameInput').focus();
}

// Hide username modal
function hideUsernameModal() {
    const modal = document.getElementById('usernameModal');
    modal.style.display = 'none';
}

// Save username
document.getElementById('saveUsername').addEventListener('click', function() {
    const usernameInput = document.getElementById('usernameInput');
    const newUsername = usernameInput.value.trim();
    
    if (newUsername) {
        username = newUsername;
        localStorage.setItem('lan_transfer_username', username);
        document.getElementById('displayUsername').textContent = username;
        document.getElementById('userBadge').style.display = 'inline-flex';
        hideUsernameModal();
    } else {
        alert('Please enter a valid username');
    }
});

// Allow Enter key to save username
document.getElementById('usernameInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('saveUsername').click();
    }
});

// Change username button
document.getElementById('changeUsername').addEventListener('click', function() {
    showUsernameModal();
    document.getElementById('usernameInput').value = username;
});

// File upload functionality
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadForm = document.getElementById('uploadForm');
const loading = document.getElementById('loading');
const browseBtn = document.getElementById('browseBtn');

// Drag and drop events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('dragover');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('dragover');
    }, false);
});

// Handle file drop
dropZone.addEventListener('drop', function(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0 && !isUploading) {
        fileInput.files = files;
        isUploading = true;
        loading.classList.add('active');
        uploadForm.submit();
    }
}, false);

// FIXED: Browse button click - now completely separate from drop zone
browseBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) {
        fileInput.click();
    }
});

// FIXED: Auto-submit when file is selected
fileInput.addEventListener('change', function(e) {
    if (fileInput.files.length > 0 && !isUploading) {
        isUploading = true;
        loading.classList.add('active');
        
        // Small delay to ensure file is fully loaded
        setTimeout(() => {
            uploadForm.submit();
        }, 150);
    }
});

// Socket.IO for real-time updates
socket.on('file_uploaded', function(data) {
    isUploading = false;
    location.reload();
});

// Chat functionality
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesDiv = document.getElementById('messages');

function sendMessage() {
    const message = messageInput.value.trim();
    if (message && username) {
        socket.emit('send_message', {
            user: username,
            message: message
        });
        messageInput.value = '';
    } else if (!username) {
        alert('Please set your username first');
        showUsernameModal();
    }
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

socket.on('receive_message', function(data) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerHTML = `
        <div class="message-user"><i class="fas fa-user-circle"></i> ${escapeHtml(data.user)}</div>
        <div class="message-text">${escapeHtml(data.message)}</div>
        <div class="message-time">${data.time}</div>
    `;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('user_connected', function(data) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.style.background = 'rgba(79, 172, 254, 0.2)';
    messageDiv.innerHTML = `
        <div class="message-text"><i class="fas fa-plug"></i> ${escapeHtml(data.message)}</div>
    `;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
