import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import { useLocalStorage } from "./useLocalStorage";
import { useBeforeUnload } from "./useBeforeUnload";

const SERVER_URL = "http://localhost:5000";

export const useChat = (roomId) => {
  // локальное состояние
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  // создаем и записываем в локальное хранинище идентификатор пользователя
  const [userId] = useLocalStorage("userId", nanoid(4));
  // получаем из локального хранилища имя пользователя
  const [username] = useLocalStorage("username");

  const socketRef = useRef(null);

  

  // let myVideoStream;
  // const videoGrid = document.getElementById("video-grid");
  // const myVideo = document.createElement("video");
  // myVideo.muted = true;
  // navigator.mediaDevices
  //   .getUserMedia({
  //     audio: true,
  //     video: true,
  //   })
  //   .then((stream) => {
  //     myVideoStream = stream;
  //     addVideoStream(myVideo, stream);
  //   });

  // const addVideoStream = (video, stream) => {
  //   video.srcObject = stream;
  //   video.addEventListener("loadedmetadata", () => {
  //     video.play();
  //     videoGrid.append(video);
  //   });
  // };

  useEffect(() => {
    // создаем экземпляр сокета, передаем ему адрес сервера
    socketRef.current = io(SERVER_URL, {
      query: { roomId },
    });
    // отправляем событие добавления пользователя,
    socketRef.current.emit("user:add", { username, userId, roomId });
    // обрабатываем получение списка пользователей и обновляем массив пользователей
    socketRef.current.on("users", (users) => setUsers(users));

    // отправляем запрос на получение сообщений
    socketRef.current.emit("message:get", { path: document.location.pathname });

    // обрабатываем получение сообщений
    socketRef.current.on("messages", (messages) => {
      // определяем, какие сообщения были отправлены данным пользователем,
      const newMessages = messages.map((msg) =>
        msg.userId === userId ? { ...msg, currentUser: true } : msg
      );
      // обновляем массив сообщений
      setMessages(newMessages);
    });

    return () => {
      // при размонтировании компонента выполняем отключение сокета
      socketRef.current.disconnect();
    };
  }, [roomId, userId, username]);

  // функция отправки сообщения
  const sendMessage = ({ messageText, senderName, path }) => {
    // добавляем в объект id пользователя при отправке на сервер
    socketRef.current.emit("message:add", {
      userId,
      messageText,
      senderName,
      path,
    });
  };
  //"user:leave" перед перезагрузкой страницы
  useBeforeUnload(() => {
    socketRef.current.emit("user:leave", userId);
  });

  // хук возвращает пользователей, сообщения и функцию для отправки
  return { users, messages, sendMessage };
};
