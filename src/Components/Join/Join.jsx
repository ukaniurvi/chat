import React, { useState } from 'react';
import "../Join/Join.css";
import Logo from "../Image/Logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Join = () => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const sendUser = () => {
    const inputValue = document.getElementById('JoinInput').value.trim();
    if (inputValue !== '') {
      setUser(inputValue);
      navigate('/Chat', { state: { user: inputValue } });
    } else {
      toast.error('Please enter a username.');
    }
  }

  return (
    <>
      <div className='joinPage'>
        <div className='JoinContainer'>
          <img src={Logo} alt="" />
          <h1>C CHAT</h1>
          <input type="text" id='JoinInput' />
          <button className='joinButton' onClick={sendUser}>logIn</button>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default Join;
