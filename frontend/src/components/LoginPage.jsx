import React from 'react';

function LoginPage(){

  const handleSignUp = async(event) => {
    event.preventDefault();
    
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h3 id="user" className="text-xl font-semibold mb-4"></h3>
      
      <form id="sign_up_form" onSubmit={handleSignUp} className="bg-white p-6 rounded-lg shadow-md w-80 mb-4">
        <h2 className="text-lg font-bold mb-4">Sign Up</h2>
        <input type="text" id="signup-email" placeholder="Email" className="w-full p-2 border border-gray-300 rounded mb-2" />
        <input type="password" id="signup-password" placeholder="Password" className="w-full p-2 border border-gray-300 rounded mb-2" />
        <input type="password" id="signup-password-confirm" placeholder="Confirm Password" className="w-full p-2 border border-gray-300 rounded mb-2" />
        <button type="submit" id="Sign Up" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit</button>
      </form>
      
      <form id="sign_in_form" className="bg-white p-6 rounded-lg shadow-md w-80 mb-4">
        <h2 className="text-lg font-bold mb-4">Sign In</h2>
        <input type="text" id="signin-email" placeholder="Email" className="w-full p-2 border border-gray-300 rounded mb-2" />
        <input type="password" id="signin-password" placeholder="Password" className="w-full p-2 border border-gray-300 rounded mb-2" />
        <button type="submit" id="Login" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Submit</button>
      </form>
      
      <button id="sign_out" className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Logout</button>
    </div>

  );

}

export default LoginPage;