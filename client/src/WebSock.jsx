import React, { useRef, useState } from "react";

const WebSock = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const [username, setUsername] = useState("");
  const socket = useRef();
  const [connected, setConnected] = useState(false);

  const connect = () => {
    socket.current = new WebSocket("ws://localhost:5000");

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        username,
        event: "connection",
        id: Date.now(),
      };
      socket.current.send(JSON.stringify(message));
    };
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };
    socket.current.onclose = () => {
      console.log("Сокет закрыт");
    };
    socket.current.onerror = () => {
      console.log("Произошла ошибка");
    };
  };

  const sendMessage = () => {
    const message = {
      username,
      message: value,
      event: "message",
      id: Date.now(),
    };
    socket.current.send(JSON.stringify(message));
    setValue("");
  };

  if (!connected) {
    return (
      <div className="center">
        <div className="form">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Введите ваше имя"
          />
          <button onClick={connect}>Войти</button>
        </div>
      </div>
    );
  }

  return (
    <div className="center">
      <div>
        <div className="form">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
          />
          <button onClick={sendMessage}>Отправить</button>
        </div>
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id}>
              {message.event === "connection" ? (
                <div className="connection_message">
                  Пользователь {message.username} подключился
                </div>
              ) : (
                <div className="message">
                  {message.username}. {message.message}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebSock;
