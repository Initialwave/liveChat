import React, { useEffect, useState } from "react";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList(list => [...list, messageData]);
    }
  };

  useEffect(() => {
    socket.on("receive_message", data => {
      setMessageList(list => [...list, data]);
      console.log(data);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Chatting</p>
      </div>
      <div className="chat-body">
        {messageList.map(messageContent => {
          return (
            <div
              className="message"
              id={username === messageContent.author ? "other" : "you"}
            >
              <div>
                <div classname="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div classname="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="type..."
          onChange={event => {
            setCurrentMessage(event.target.value);
          }}
          onKeyDown={event => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
