const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "../public")));

// Run when a client connects
io.on("connection", (socket) => {
  // sends welcome message whenever a user enters
  io.emit("message", "Welcome to the chatCord!");

  // Broadcast when a user connects, send for everyone,
  // excecpt the user who sold this
  console.log("New connection");
  socket.broadcast.emit("message", "A user has joined to the chat");

  // run when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", "The user had left the chat.");
  });

  // listen for chatMessage
  socket.on("chatMessage", (message) => {
    io.emit("message", message);
  });
});

const PORT = 3333 || process.env.PORT;
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`);
});
