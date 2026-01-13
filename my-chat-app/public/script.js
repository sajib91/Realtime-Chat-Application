const socket = io();


let myUsername = '';
let currentTarget = null; 
let isPrivateMode = false;

const loginOverlay = document.getElementById('login-overlay');
const usernameInput = document.getElementById('usernameInput');
const userListDiv = document.getElementById('userList');
const messagesDiv = document.getElementById('messages');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const groupInput = document.getElementById('groupInput');
const joinGroupBtn = document.getElementById('joinGroupBtn');
const leaveGroupBtn = document.getElementById('leaveGroupBtn');
const chatStatus = document.getElementById('chatStatus');


// Login
document.getElementById('loginBtn').addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if(name) {
        myUsername = name;
        socket.emit('login', name);
        loginOverlay.style.display = 'none';
    }
});

// Join Group
joinGroupBtn.addEventListener('click', () => {
    const group = groupInput.value.trim();
    if(group) {
        socket.emit('joinGroup', group);
        setActiveTarget(group, false);
        toggleGroupControls(true);
        groupInput.value = ''; 
    }
});

// Leave Group
leaveGroupBtn.addEventListener('click', () => {
    if(!isPrivateMode && currentTarget) {
        socket.emit('leaveGroup', currentTarget);
        setActiveTarget(null, false);
        toggleGroupControls(false);
    }
});

// Send Message
sendBtn.addEventListener('click', sendMessage);
msgInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const text = msgInput.value.trim();
    if(!text || !currentTarget) return;

    if(isPrivateMode) {
        socket.emit('privateMessage', { targetUser: currentTarget, message: text });
    } else {
        socket.emit('groupMessage', { groupName: currentTarget, message: text });
    }
    msgInput.value = '';
}


function setActiveTarget(target, isPrivate) {
    currentTarget = target;
    isPrivateMode = isPrivate;
    
    const disabled = !target;
    msgInput.disabled = disabled;
    sendBtn.disabled = disabled;

    if(disabled) {
        chatStatus.innerText = "Select a User or Join a Group";
        chatStatus.style.color = "#666";
    } else {
        chatStatus.innerText = isPrivate ? `Chatting with ${target}` : `Group: ${target}`;
        chatStatus.style.color = "#4f46e5";
    }

    // UI Updates for Sidebar
    document.querySelectorAll('.user-item').forEach(el => el.classList.remove('active'));
    if(isPrivate && target) {
        const el = document.getElementById(`user-${target}`);
        if(el) el.classList.add('active');
    }
    
    addSystemMessage(`Switched to ${isPrivate ? 'Private Chat' : 'Group Chat'}`);
}

function toggleGroupControls(joined) {
    if(joined) {
        joinGroupBtn.classList.add('hidden');
        groupInput.classList.add('hidden');
        leaveGroupBtn.classList.remove('hidden');
    } else {
        joinGroupBtn.classList.remove('hidden');
        groupInput.classList.remove('hidden');
        leaveGroupBtn.classList.add('hidden');
    }
}

function addSystemMessage(text) {
    const div = document.createElement('div');
    div.className = 'message msg-system';
    div.innerText = text;
    messagesDiv.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// --- SOCKET EVENTS ---

socket.on('updateUserList', (users) => {
    userListDiv.innerHTML = '';
    users.forEach(user => {
        if(user === myUsername) return; // Don't show self
        
        const div = document.createElement('div');
        div.className = 'user-item';
        div.id = `user-${user}`;
        div.innerText = user;
        
        div.addEventListener('click', () => {
          
            if(!isPrivateMode && currentTarget) {
              
                toggleGroupControls(false); 
            }
            setActiveTarget(user, true);
        });
        
        userListDiv.appendChild(div);
    });
});

socket.on('chatMessage', (data) => {
    const div = document.createElement('div');
    
    // Determine class based on sender
    let cssClass = '';
    if (data.user === myUsername) {
        cssClass = 'msg-outgoing';
    } else {
        cssClass = 'msg-incoming';
    }

    div.className = `message ${cssClass}`;
    
    // Message Content
    const meta = document.createElement('div');
    meta.className = 'message-meta';
    
    if(data.type === 'group') meta.innerText = `${data.user} (Group)`;
    else meta.innerText = data.user;

    div.appendChild(meta);
    div.appendChild(document.createTextNode(data.text));

    messagesDiv.appendChild(div);
    scrollToBottom();
});

socket.on('systemMessage', (msg) => {
    addSystemMessage(msg);
});