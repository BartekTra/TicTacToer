import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/authActions.js';


function LandingPage(){
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLoginButton = async(e) => {
    navigate("/login");
  }

  const handleRegisterButton = async(e) => {
    navigate("/register");
  }

  const handleLogoutButton = async(e) => {
    dispatch(logoutUser());
  }


  return(
    
    <div className='bg-mybg h-screen w-screen flex flex-row justify-center items-center text-white'>
      <div className="flex flex-col">
        <p> Siema </p>
        {user ? <h2>Witaj, {user.email}!</h2> : <Login />}

        <button onClick={ handleLoginButton } 
        className="bg-gray-600 active:bg-gray-800 w-15"
        > Login </button>

        <button onClick={ handleRegisterButton } 
        className="bg-gray-600 active:bg-gray-800 w-15"
        > Register </button>

        <button onClick={ handleLogoutButton } 
        className="bg-gray-600 active:bg-gray-800 w-15"
        > Logout </button>
      </div>
    </div>
  )
}

export default LandingPage;