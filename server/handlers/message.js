const { nanoid } = require("nanoid");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db/messages.json");
const db = low(adapter);

module.exports = (io, socket) => {
  // запрос на получение сообщений
  const get = ({ path }) => {
    let messages = [];
    // получаем сообщения из БД  и фильтруем их по комнатам
    db.get("messages")
      .value()
      .forEach((element) => {
        if (element.path == path) messages.push(element);
      });
    // передаем сообщения пользователям, находящимся в комнате
    io.in(socket.roomId).emit("messages", messages);
  };

  //добавление сообщения
  const add = (message) => {
    db.get("messages")
      .push({
        // генерируем идентификатор
        Id: nanoid(8),
        createdAt: new Date(),
        ...message,
      })
      .write();
    get({ path: message.path });
  };

  // регистрируем обработчики
  socket.on("message:get", get);
  socket.on("message:add", add);
};
