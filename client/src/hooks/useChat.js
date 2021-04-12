import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "peerjs";
import { nanoid } from "nanoid";
import { useLocalStorage } from "./useLocalStorage";
import { useBeforeUnload } from "./useBeforeUnload";

const SERVER_URL = "http://localhost:5000";

export const useChat = (roomId) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  // создаем и записываем в локальное хранинище идентификатор пользователя
  const [userId] = useLocalStorage("userId", nanoid(4));
  // получаем из локального хранилища имя пользователя
  const [username] = useLocalStorage("username");

  const socketRef = useRef(null);
  const peers = {};

  useEffect(() => {
    // создаем экземпляр сокета, передаем ему адрес сервера
    socketRef.current = io(SERVER_URL, {
      query: { roomId, userId },
    });

    // отправляем событие добавления пользователя,
    socketRef.current.emit("user:add", { username, userId });

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

  const videoShow = () => {
    const myPeer = new Peer(userId, {
      host: "/",
      port: "3001",
    });
    let lastStream;
    //отправляем на сервер событие входа пользователя
    myPeer.on("open", (id) => {
      socketRef.current.emit("join-room", id);
    });

    myPeer.on("call", function (call) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream);
          // выводим на страницу видео собеседника
          call.on("stream", function (remoteStream) {
            // проверка дублирования
            if (remoteStream.id !== lastStream) {
              lastStream = remoteStream.id;
              addVideoStream(remoteStream, document.createElement("video"));
            }
          });
        });
    });

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        //добавляем свое видео на экран
        const selfVideo = document.createElement("video");
        selfVideo.setAttribute("id", "selfVideo");
        if (!document.getElementById("selfVideo")){
          addVideoStream(stream, selfVideo)
          };
        //при подключении пользователя соединяемся и отправляем ему свое видео
        socketRef.current.on("user-connected", (userId) => {
          connectToNewUser(peers, myPeer, userId, stream);
        });
        //закрываем вызов
        socketRef.current.on("user-disconnected", (userId) => {
          if (peers[userId]) peers[userId].close();
        });
      });
  }

  const videoHide = () => {
    Object.keys(peers).forEach(function (key) {
      this[key].close();
    }, peers);
    // "костыль" позволяющий завершить видеовызов не хосту по на жатию на кнопку
    if (document.getElementById("hostName").textContent === "")
      document.location.reload();
  }

  // добавление видео на страницу
  function addVideoStream(stream, video) {
    const videoGrid = document.getElementById("video-grid");
    video.srcObject = stream;
    video.setAttribute(
      "style",
      "border-radius: 1rem; width: 40vh; margin: 5px 0px;"
    );
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGrid.append(video);
  }

  // соединение с остальными пользователями
  function connectToNewUser(peers, peer, userId, stream) {
    let lastStream;
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    //отправляем сове видео
    call.on("stream", (userVideoStream) => {
      // проверка дублирования
      if (userVideoStream.id !== lastStream) {
        lastStream = userVideoStream.id;
        addVideoStream(userVideoStream, video);
        document.getElementById("hostName").textContent = `You are the HOST`;
      }
      // заносим вызов в список
      peers[userId] = call;
    });
    call.on("close", () => {
      video.remove();
    });
  }

  //"user:leave" перед перезагрузкой страницы
  useBeforeUnload(() => {
    socketRef.current.emit("user:leave", userId);
  });

  // хук возвращает пользователей, сообщения и функцию для отправки
  return { users, messages, sendMessage, videoShow, videoHide };
};
