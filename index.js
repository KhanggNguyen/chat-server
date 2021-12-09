const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const PORT = process.env.PORT || 8000;

const router = require('./router');
const {addUser, removeUser, getUser, getUsers} = require('./users');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
      origin: '*',
    }
  });

app.use(router);
app.use(cors());

io.on('connect', (socket) => {

    socket.on('join', ({name, room}, callback) => {
        console.log(`${name} has connected to room ${room}`);
        const { error, user } = addUser({id: socket.id, name: name, room: room});
        
        if(error) return callback(error);

        socket.emit( 'message', { user: 'admin', text: `Hello ${user.name}, welcome to room ${room}.`} );

        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name}, has joined!`}); 

        socket.join(user.room);

        io.to(user.room).emit('roomData', {room: user.room, users: getUsers(user.room)});

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        
        io.to(user.room).emit('message', { user : user.name, text: message});
        io.to(user.room).emit('roomData', {room: user.room,  users: getUsers(user.room)});

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);$
        
        if(user) io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left.`});
        io.to(user.room).emit('roomData', { room: user.room, users: getUsers(user.room)});
    });
});

server.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`));

