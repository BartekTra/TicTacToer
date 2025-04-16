import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { preventUnhandledRejection } from "@apollo/client/utilities";
import { useLazyQuery } from "@apollo/client";
import { CHECK_AUTH } from "../graphql/queries/checkAuth";



function LandingPage(){
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dataTest, setDataTest] = useState();
  const [ checkAuth, { loading, error, data }]  = useLazyQuery(CHECK_AUTH);

  const handleTestButton = async(e) => {
    e.preventDefault();
    await checkAuth({});
    console.log(loading);
    console.log(data);
    console.log(error);

  }

  const handleLoginButton = async(e) => {
    navigate("/login");
  }

  const handleRegisterButton = async(e) => {
    navigate("/register");
  }

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

      </div>
    </div>
  )
}

export default LandingPage;