const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');

const server = app.listen(8000, () => {
    console.log('server on port 8000');
});

const io = socket(server);

// listen to socket
io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('message', (message) => { 
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message); // send message to all sockets except the one who wrote it
    });
    socket.on('user', (user) => { // check if there is a new user
        users.push(user); // and add them to array
        console.log('Oh, I\'ve got new user: ' + user.id);
        socket.broadcast.emit('newUser', { author: 'Chat Bot', content: user.name + ' has joined the conversation!' });
        console.log('users:', users);
    })
    socket.on('disconnect', () => {
        console.log('Oh, socket ' + socket.id + ' has left');
        const userIndex = users.findIndex(user => user.id === socket.id);
        const userLogin = users[userIndex].name;
        socket.broadcast.emit('removeUser', { author: 'Chat Bot', content: userLogin + ' has left the conversation :(' });
        users.splice(userIndex, 1);
        console.log('users:', users);
    });
    console.log('I\'ve added a listener on message and disconnect events \n');
});

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client/')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});