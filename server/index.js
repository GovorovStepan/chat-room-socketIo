const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const MessageHandlers = require("./handlers/message");
const UserHandlers = require("./handlers/user");

const onConnection = (socket) => {
  console.log("User connected");
  // получаем название комнаты
  const { roomId, userId } = socket.handshake.query;
  // сохраняем название комнаты в соответствующем свойстве сокета
  socket.roomId = roomId;
  // присоединяемся к комнате (входим в нее)
  socket.join(roomId);
  socket.on("join-room", () => {
    socket.broadcast.to(roomId).emit("user-connected", userId);
  });

  // обработчики
  MessageHandlers(io, socket);
  UserHandlers(io, socket);

  // отключение сокета-пользователя
  socket.on("disconnect", () => {
    console.log("User disconnected");
    socket.broadcast.to(roomId).emit("user-disconnected", userId);
    // покидаем комнату
    socket.leave(roomId);
  });
};

// обрабатываем подключение
io.on("connection", onConnection);

// запускаем сервер
server.listen(5000, () => {
  console.log("listening on *:5000");
});
