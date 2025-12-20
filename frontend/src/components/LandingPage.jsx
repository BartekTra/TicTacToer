import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { preventUnhandledRejection } from "@apollo/client/utilities";
import { useLazyQuery } from "@apollo/client";
import { CHECK_AUTH } from "../graphql/queries/checkAuth";
import { useUser } from '../context/UserContext';
import { LOGIN_USER } from '../graphql/mutations/loginUser.js';
import { useMutation } from '@apollo/client';
import { loginSuccess } from '../store/authSlice';


function LandingPage(){
  const[loginUser] = useMutation(LOGIN_USER);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataTest, setDataTest] = useState();
  const [ checkAuth, { loading, error, data }]  = useLazyQuery(CHECK_AUTH);
  const { tempUser, loadingTempUser } = useUser();
  const { user, setUser } = useState("");
  useEffect(()=> {
    console.log(tempUser);
    if(tempUser){
      setUser(JSON.parse(tempUser));
      console.log(user);
    }
  },[tempUser])

  const handleLoginTestButton = async(e) => {
    e.preventDefault(); 
    try {
      const response = await loginUser({ 
        variables: { email: "testuje@wp.pl", password: "12qwaszx" }
      })
      console.log(response);
      const token = JSON.parse(response.data.loginUser.token);
      console.log("Token here 1: " + typeof token);
      if(token){
        dispatch(loginSuccess({user: { email: "testuje@wp.pl" }, token}));
        console.log(token);
        alert('Zalogowano!');
      }
    } catch( err ){
      console.error(err);
    }
  }

  const handleTestButton = async(e) => {
    e.preventDefault();
    const response = await checkAuth({});
    const test = await data;
    console.log("response below");
    console.log(response);
    console.log(loading);
    console.log("lpage 21# " + test);
    console.log(data);
    console.log(error);

  }

  const handleLoginButton = async(e) => {
    navigate("/login");
  }

  const handleRegisterButton = async(e) => {
    navigate("/register");
  }

  if (loadingTempUser) return <p>Ładowanie...</p>;

  return(
    
    <div className='bg-mybg h-screen w-screen flex flex-row justify-center items-center text-white'>
      <div className="flex flex-col">
        <p> SiemaXD </p>
        { <h2>Witaj,  !</h2>}

        <button onClick={ handleLoginButton } 
        className="bg-gray-600 active:bg-gray-800 w-15"
        > Login </button>

        <button onClick={ handleRegisterButton } 
        className="bg-gray-600 active:bg-gray-800 w-15"
        > Register </button>

        <button onClick={ handleTestButton } 
        className="bg-gray-600 active:bg-gray-800 w-15"
        > TEST </button>

        <button onClick={ handleLoginTestButton } 
        className="bg-gray-600 active:bg-gray-800 w-15"
        > LoginDebugging </button>


      </div>
    </div>
  )
}

export default LandingPage;