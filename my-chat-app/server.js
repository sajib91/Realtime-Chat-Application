const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let users = {};

io.on('connection', (socket) => {
    
    
    socket.on('login', (username) => {
        users[username] = socket.id;
        socket.username = username;
        console.log(`User logged in: ${username}`);
        
       
        io.emit('updateUserList', Object.keys(users));
        socket.emit('systemMessage', `Welcome, ${username}!`);
    });

    
    socket.on('joinGroup', (groupName) => {
        socket.join(groupName);
        console.log(`${socket.username} joined group: ${groupName}`);
        
       
        socket.to(groupName).emit('systemMessage', `${socket.username} has joined the group.`);
       
        socket.emit('systemMessage', `You joined group: ${groupName}`);
    });

    // 3. Leave Group
    socket.on('leaveGroup', (groupName) => {
        socket.leave(groupName);
        console.log(`${socket.username} left group: ${groupName}`);
        
        socket.to(groupName).emit('systemMessage', `${socket.username} has left the group.`);
        socket.emit('systemMessage', `You left group: ${groupName}`);
    });

    // 4. Group Message
    socket.on('groupMessage', ({ groupName, message }) => {
       
        io.to(groupName).emit('chatMessage', {
            user: socket.username,
            text: message,
            type: 'group',
            source: groupName,
            isMine: false 
        });
    });

    // 5. Private Message
    socket.on('privateMessage', ({ targetUser, message }) => {
        const targetSocketId = users[targetUser];
        
        if (targetSocketId) {
            
            io.to(targetSocketId).emit('chatMessage', {
                user: socket.username,
                text: message,
                type: 'private',
                source: 'Private',
                isMine: false
            });
            
            socket.emit('chatMessage', {
                user: socket.username,
                text: message,
                type: 'private',
                source: `To ${targetUser}`,
                isMine: true
            });
        } else {
            socket.emit('systemMessage', `User ${targetUser} is offline.`);
        }
    });

    // 6. Disconnect
    socket.on('disconnect', () => {
        if(socket.username) {
            console.log(`User disconnected: ${socket.username}`);
            delete users[socket.username];
            io.emit('updateUserList', Object.keys(users));
        }
    });
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});