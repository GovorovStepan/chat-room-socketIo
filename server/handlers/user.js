// имитация бд
const users = {
  1: { username: "Max", online: false, roomId: "meeting" },
  2: { username: "Yana", online: false, roomId: "disputes" },
};

module.exports = (io, socket) => {
  // запрос на получение пользователей
  const get = () => {
    let send = {};
    let i = 0;
    Object.keys(users).forEach(function (key) {
      if (this[key].roomId == socket.roomId) {
        i++;
        send[`${i}`] = this[key] ;
      }
    }, users);
    io.in(socket.roomId).emit("users", send);
  };

  //  добавление пользователя
  const add = ({ username, userId }) => {
    // проверяем, имеется ли пользователь в БД
    if (!users[userId]) {
      // если не имеется, добавляем его в БД
      users[userId] = { username, online: true, roomId: socket.roomId };
    } else {
      // если имеется, меняем  статус на онлайн  и комнату к которой подключен 
      users[userId].online = true;
      users[userId].roomId  = socket.roomId ;
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
