import { getObsQueryOptions } from '@apollo/client/react/hooks/useQuery';
import React, { useState, useEffect } from 'react';

function LoginPage(){
  const API_URL = "http://localhost:3000/users/tokens";
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[passwordConfirmation, setPasswordConfirmation] = useState("");
  const[accessToken, setAccessToken] = useState("");
  const[refreshToken, setRefreshToken] = useState("");
  const[resourceOwner, setResourceOwner] = useState("");

  useEffect(() => {
    setRefreshToken(localStorage.getItem("refresh_token"));
  }, []);
  
  const handleSignUp = async(event) => {
    event.preventDefault();

    if(password === passwordConfirmation){
      const response = await fetch(`http://localhost:3000/users/tokens/sign_up`, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {"Content-Type":"application/json", "Accept": "application/json",},
      });
      const data = await response.json();
      console.log(data);
      await handleAuthResponse(data);
      userSession();
    } else {
      alert("Passwords must be the same!");
    }
  }

  const handleAuthResponse = async(response) => {
    const data = response;

    localStorage.setItem("resource_owner", JSON.stringify(data.resource_owner));
    localStorage.setItem("refresh_token", data.resource_owner);
    setAccessToken(data.token);
    setRefreshToken(data.refresh_token);
    setResourceOwner(data.resource_owner);

    console.log("Local storage refresh token: ", localStorage.getItem("refresh_token"));
    console.log(refreshToken);
  }

  const userSession = async() => {
    await refreshTokenFunction();
    await requestNewAccessToken();
    getUser();
  }

  const resetTokens = async() => {
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("resource_owner");
    setAccessToken = null;
    setRefreshToken = null;
    setResourceOwner = null;
  }

  const refreshTokenFunction = async() => {
    if(nullOrUndefined(refreshToken)){
      return;
    }
    console.log("refresh token function, refresh token: ", refreshToken);

    try {
      const response = await fetch(`http://localhost:3000/users/tokens/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          // Handle the error, such as redirecting to the login page
        } else {
          throw new Error(response.statusText);
        }
      }
      const data = await response.json();
      console.log("Setting access token to: ", data.token);
      localStorage.setItem("resource_owner", JSON.stringify(data.resource_owner));
      localStorage.setItem("refresh_token", data.refresh_token);
      setAccessToken = data.token;
      setRefreshToken = data.refresh_token;
      setResourceOwner = data.resource_owner;
      
    } catch (err) {
      console.log("Error refreshing token: ", err);
      resetTokens();
      userSession();
    }
  }

  const nullOrUndefined = async(itemToCheck) => {
    return itemToCheck == null || itemToCheck === "undefined";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] p-6 text-white">
      <h3 id="user" className="text-xl font-semibold mb-4"></h3>
      <p> {JSON.stringify(resourceOwner)} resource owner  </p>
      <p> {JSON.stringify(refreshToken)} refresh token </p>
      <form id="sign_up_form" onSubmit={handleSignUp} className="bg-[#202020] p-6 rounded-lg shadow-md w-80 mb-4">
        <h2 className="text-lg text-white font-bold mb-4">Sign Up</h2>
        
        <input type="text" placeholder="Email" 
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border text-white border-gray-300 rounded mb-2" />
        
        <input type="password" placeholder="Password"
        onChange={(e) => setPassword(e.target.value)} 
        className="w-full p-2 text-white border border-gray-300 rounded mb-2" />
        
        <input type="password" placeholder="Confirm Password"
        onChange={(e) => setPasswordConfirmation(e.target.value)} 
        className="w-full p-2 text-white border border-gray-300 rounded mb-2" />

        <button type="submit" className="w-full text-white bg-blue-500  p-2 rounded hover:bg-blue-600">Submit</button>
      </form>
      
      <form id="sign_in_form" className="bg-[#202020] p-6 rounded-lg shadow-md w-80 mb-4">
        <h2 className="text-lg font-bold mb-4 text-white">Sign In</h2>
        <input type="text" id="signin-email" placeholder="Email" className="text-white w-full p-2 border border-gray-300 rounded mb-2" />
        <input type="password" id="signin-password" placeholder="Password" className="text-white w-full p-2 border border-gray-300 rounded mb-2" />
        <button type="submit" id="Login" className="text-white w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Submit</button>
      </form>
      
      <button id="sign_out" className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Logout</button>
    </div>

  );

}

export default LoginPage;