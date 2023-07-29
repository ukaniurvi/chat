// Server code
const express = require("express");
const app = express();
const http = require('http');
const socket = require("socket.io");
const cors = require("cors");
const { log } = require("console");
const port = 4500 || process.env.PORT;

app.use(cors());

const users = {}; // Use an object to store user data, with socket ID as the key

app.get("/", (req, res) => {
    res.send("Hello its working");
});

const server = http.createServer(app);

const io = socket(server);
io.on("connection", (socket) => {
    console.log("user connected");

    socket.on('joined', ({ user }) => {
        console.log("user", user);
        users[socket.id] = user; // Store user data using socket ID as key
        console.log(`${user} has Joined`);
        socket.broadcast.emit("userJoined", { user: "Admin", message: `${user} Has joined` });
        socket.emit('welcome', { user: "Admin", message: `Welcome to the chat, ${user}` });
    });

    socket.on('message', ({ message, id }) => {
        console.log("message", users[socket.id], message, id);
        io.emit('sendMessage', { user: users[socket.id], message, id });
    });

    socket.on("disconnect", () => {
        const user = users[socket.id]; // Get the user who disconnected
        if (user) {
            socket.broadcast.emit('leave', { user: 'Admin', message: `${user} has left` });
            console.log(`${user} left`);
            delete users[socket.id]; // Remove the user data from the object when they disconnect
        }
    });
});

server.listen(port, () => {
    console.log(`server running at port : http://localhost:${port}`);
});
