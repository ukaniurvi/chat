import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import socketIO from "socket.io-client";
import Message from '../Message/Message';
import ReactScrollToBottom from "react-scroll-to-bottom"
import closeIcon from "../Image/close1437.jpg"
import "./Chat.css"

const ENDPOINT = "http://localhost:4500"; 

let socket;
const Chat = () => {
  const [id, setid] = useState("");
  const [message, setmessage] = useState([])
  const location = useLocation();
  const user = location.state?.user || '';

  const send = () => {
    const message = document.getElementById('chatInput').value;
    socket.emit('message', { message, id });
    document.getElementById('chatInput').value = "";
  }

  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ['websocket'] });
    socket.on("connect", () => {
      alert("Connected to socket server!");
      setid(socket.id);
    });

    socket.emit('joined', { user });

    socket.on('welcome', (data) => {
      setmessage([...message,data])
      console.log(data.user, data.message);
    });

    socket.on('userJoined', (data) => {
      setmessage([...message,data])
      console.log(data.user, data.message);
    });

    socket.on('leave', (data) => {
      setmessage([...message,data])
      console.log(data.user, data.message);
    });

    return () => {
      socket.off();
    };
  }, []); // Make sure to add 'user' as a dependency, so the useEffect is triggered when user changes

  useEffect(() => {
    socket.on('sendMessage', (data) => {
      setmessage([...message,data])
      console.log("dataaaaaaaa", data);
      // console.log(data.user, data.message, data.id);
    });

    return () => {
      // Clean up any remaining event listeners
      socket.off('sendMessage');
    };
  }, [message]);

  return (
    <>
      <div className='ChatPage'>
        <div className='ChatContainer'>
          <div className='header'>
            <h2>C CHAT</h2>
            <a href="/">
            <img src={closeIcon} alt="close" />
            </a>
          </div>
          <ReactScrollToBottom className='chatBox'>
          {message.map((item, i) => <Message user={item.id === id?"you" : item.user} message={item.message} classs={item.id === id?'right' :"left"} /> )}
          </ReactScrollToBottom>
          <div className='inputBox'>
          <input onKeyPress={(event) => event.key === "Enter" ? send() : null} type="text" id='chatInput' />
            <button onClick={send} className='sendButton'>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
