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
        console.log('Oh, I\'ve got new user: ' + socket.id);
    })
    socket.on('disconnect', (user) => { 
        console.log('Oh, socket ' + socket.id + ' has left');
        user = socket.id;
        userIndex = users.indexOf(user);
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