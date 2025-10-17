const socket = io();
let username = '';
let isUploading = false;

// Cookie functions as localStorage alternative
function setCookie(name, value, days = 365) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
}

function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Check if username exists
window.onload = function() {
    const savedUsername = getCookie('lan_transfer_username');
    if (savedUsername) {
        username = savedUsername;
        document.getElementById('displayUsername').textContent = username;
        document.getElementById('userBadge').style.display = 'inline-flex';
    } else {
        showUsernameModal();
    }
    
    console.log('Page loaded, username:', username);
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
        setCookie('lan_transfer_username', username);
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

console.log('Elements found:', {
    dropZone: !!dropZone,
    fileInput: !!fileInput,
    uploadForm: !!uploadForm,
    loading: !!loading,
    browseBtn: !!browseBtn
});

// Prevent default drag behaviors on document
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.addEventListener(eventName, function(e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);
});

// Highlight drop zone when dragging over it
dropZone.addEventListener('dragenter', function(e) {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    dropZone.classList.remove('dragover');
});

// Handle file drop
dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragover');
    
    const dt = e.dataTransfer;
    const files = dt.files;
    
    console.log('Files dropped:', files.length);
    
    if (files.length > 0 && !isUploading) {
        fileInput.files = files;
        handleFileUpload();
    }
});

// Browse button click handler
browseBtn.addEventListener('click', function(e) {
    console.log('Browse button clicked!');
    e.preventDefault();
    e.stopPropagation();
    
    if (!isUploading) {
        console.log('Triggering file input...');
        fileInput.click();
    } else {
        console.log('Already uploading, ignoring click');
    }
});

// Also try adding click to the drop zone (optional fallback)
dropZone.addEventListener('click', function(e) {
    // Only trigger if clicking directly on drop zone, not the button
    if (e.target === dropZone || e.target.closest('.upload-icon, .upload-text, .upload-subtext')) {
        console.log('Drop zone clicked');
        if (!isUploading) {
            fileInput.click();
        }
    }
});

// Handle file selection
fileInput.addEventListener('change', function(e) {
    console.log('File input changed');
    console.log('Files selected:', fileInput.files.length);
    
    if (fileInput.files.length > 0) {
        console.log('File name:', fileInput.files[0].name);
        console.log('File size:', fileInput.files[0].size);
        
        if (!isUploading) {
            handleFileUpload();
        }
    }
});

// Function to handle file upload
function handleFileUpload() {
    console.log('handleFileUpload called');
    
    if (isUploading) {
        console.log('Already uploading, skipping');
        return;
    }
    
    if (fileInput.files.length === 0) {
        console.log('No files selected');
        return;
    }
    
    isUploading = true;
    loading.classList.add('active');
    
    console.log('Submitting form...');
    
    // Submit the form
    uploadForm.submit();
}

// Socket.IO for real-time updates
socket.on('file_uploaded', function(data) {
    console.log('File uploaded event received:', data);
    isUploading = false;
    location.reload();
});

socket.on('connect', function() {
    console.log('Socket.IO connected');
});

socket.on('disconnect', function() {
    console.log('Socket.IO disconnected');
});

// Reset upload state if there's an error
window.addEventListener('pageshow', function() {
    console.log('Page show event');
    isUploading = false;
    loading.classList.remove('active');
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

console.log('Script fully loaded and initialized');