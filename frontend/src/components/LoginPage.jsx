import React, { useState, useEffect } from 'react';
import { LOGIN_USER } from '../graphql/mutations/loginUser.js';

import { loginSuccess } from '../store/authSlice';
import { useMutation } from '@apollo/client';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import './Themes.css'


function LoginPage(){
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[testtt, setTesttt] = useState(JSON.parse(localStorage.getItem("token")));
  const test = testtt["access-token"]
  const[loginUser] = useMutation(LOGIN_USER);
  const dispatch = useDispatch();


  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ variables: { email: email, password: password }})
      console.log(response);
      const token = response.data.loginUser.token;
      console.log(token);
      if(token){
        dispatch(loginSuccess({user: { email }, token}));
        axios.defaults.headers.common['access-token'] = token['access-token'];
        console.log(axios.defaults.headers.common['access-token']);
        axios.defaults.headers.common['client'] = token.client;
        axios.defaults.headers.common['uid'] = token.uid;
        alert('Zalogowano!');
      }
    } catch( err ){
      console.error(err);
    }
  }



  return (
    
    <div className="bg-mybg h-screen w-screen flex flex-row justify-center items-center text-white">
      <div className='w-100 h-100 outline-1 outline-white space-y-40'>
      <p> { testtt } </p>
        <div>
          <form onSubmit={handleLogin} className='text-white flex flex-col items-center space-y-2 m-2'>
            <input type="text" placeholder='Email'
            className='
            peer outline-1 outline-white bg-myBg2 w-[50%]
            placeholder:opacity-10 placeholder:text-mytext
            placeholder:transition-opacity placeholder:duration-[500ms]
            hover:placeholder:opacity-100 placeholder:p-2' 
            onChange={(e) => setEmail(e.target.value)}/>
            
            <input type="text" 
            className="
            peer outline-1 outline-white bg-myBg2 w-[50%]
            placeholder:opacity-10 placeholder:text-mytext
            placeholder:transition-opacity placeholder:duration-[500ms]
            hover:placeholder:opacity-100 placeholder:p-2" 
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}/>  
            <button type="submit"
            className='outline-1 outline-white bg-myBg2 w-[50%] 
            text-mytext/10 duration-[500ms] transition-colors text-left px-2
            hover:text-mytext hover:duration-[500ms] hover:transition-colors'
            > Log In </button>
          </form>
        </div>



      </div>
    </div>
  );

}

export default LoginPage;