// имитация бд
const users = {};

module.exports = (io, socket) => {
  // запрос на получение пользователей
  const get = () => {
    io.in(socket.roomId).emit("users", users);
  };

  //  добавление пользователя
  const add = ({ username, userId }) => {
    // проверяем, имеется ли пользователь в БД
    if (!users[userId]) {
      // если не имеется, добавляем его в БД
      users[userId] = { username, online: true, roomId: socket.roomId };
    } else {
      // если имеется, меняем  статус на онлайн  и комнату к которой подключен
      users[userId].username = username;
      users[userId].online = true;
      users[userId].roomId = socket.roomId;
    }
    get();
  };

  // обрабатываем удаление пользователя
  const remove = (userId) => {
    users[userId].online = false;
    get();
  };

  //  обработчики
  socket.on("user:get", get);
  socket.on("user:add", add);
  socket.on("user:leave", remove);
};
