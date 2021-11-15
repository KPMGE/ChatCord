import express from "express";
import { Server } from "socket.io"; // replace require('socket.io')
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer } from "http";

// creating __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

// set static folder
app.use(express.static(join(__dirname, "../public")));

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
