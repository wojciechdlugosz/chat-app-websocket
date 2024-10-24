const socket = io();

// listeners

socket.on('message', ({ author, content }) => addMessage(author, content))

// DOM elements

const loginForm = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');

let userName = '';

// login form
loginForm.addEventListener('submit', e => login(e));
const login = (e) => {
    e.preventDefault();
    if (userNameInput.value == '') {
        alert('What is your name?')
    } else {
        userName = userNameInput.value;
        socket.emit('user', { name: userName, id: socket.id });
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
    }
};

// send message
addMessageForm.addEventListener('submit', e => sendMessage(e));
const sendMessage = (e) => {
    e.preventDefault();
    if (messageContentInput.value == '') {
        alert('What is your message?');
    } else {
        addMessage(userName, messageContentInput.value);
        socket.emit('message', { author: userName, content: messageContentInput.value });
        messageContentInput.value = '';
    }
};

const addMessage = (author, content) => {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if (author === userName) message.classList.add('message--self');
    message.innerHTML = `
        <h3 class="message__author">${author === userName ? 'You' : author}</h3>
        <div class="message__content">${content}</div>
    `;
    messagesList.appendChild(message);
};