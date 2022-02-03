require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: {origin:'*'}});
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const room = require('./models/room');
const { addUser, removeUser, getUser, getUsersInRoom } = require("./UserRoom");

// Socket.io
io.on('connection', socket => {
    // Pošiljanje canvasa pri risanju
    socket.on('canvas-data', (data) => {
        io.emit('canvas-data', data);
    })

    // Pridružitev v chat
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser(
            { id: socket.id, name, room });
 
        if (error) return callback(error);
 
        // Emit will send message to the user who had joined
        socket.emit('message', { name: 'admin', message:
            `${user.name},
            welcome to room with id: ${user.room}.` });
 
        // Broadcast will send message to everyone in the room except the joined user
        socket.broadcast.to(user.room)
            .emit('message', { name: "admin",
            message: `${user.name}, has joined` });
 
        socket.join(user.room);
 
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
        callback();
    })

    // Pošiljanje sporočila
    socket.on('message', ({ name, message }) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message',
            { name: name, message: message });
    })

    // Začetek igre
    socket.on('start', ( { master } ) => {
        io.to(master.room).emit('start', {});
        io.to(master.room).emit('message', { name: 'admin', message:
        `The game has started!`});
        io.to(master.id).emit('next', {});
    })

    // Naslednji igralec
    socket.on('next', ( { master } ) => {
        io.to(master.id).emit('next', {});
    })

    // Poteza
    socket.on('turn', ( { word, user } ) => {    
        io.to(user.id).emit('message', { name: 'admin', message:
        `Draw a ${word}!`});
    })

    // Konec igre
    socket.on('end', ( { master } ) => {
        socket.emit("message", { name: 'admin', message: `The game is over!` })
        io.to(master.room).emit('end', {});
  
    })

    // Disconect
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message',{ name: 'admin', message:
            `${user.name} had left` });

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    })
});

// Database connection
connection();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Requests
const Users = require('./models/user')

// Dobimo vse uporabnike
app.get('/users', async (req, res) => {
    const users = await Users.User.find();

    res.json(users);
})

// Dobimo ime uporabnika glede na email
app.get('/users/:e', async (req, res) => {
    const user = await Users.User.findOne({ email: req.params.e });

    res.json(user);
})

// Dobimo vse sobe
app.get('/rooms', async (req, res) => {
    const rooms = await room.find();

    res.json(rooms);
})

// Dodamo sobo
app.post('/room/new', (req, res) => {
    const r = new room({
        name: req.body.name
    })

    r.save();

    res.json(r);
})

// Izbrisemo sobo
app.delete('/room/delete/:id', async (req, res) => {
    const result = await room.findByIdAndDelete(req.params.id);

    res.json(result);
})

const port = process.env.PORT || 8080;
http.listen(port, console.log(`Listening on port ${port}...`));
