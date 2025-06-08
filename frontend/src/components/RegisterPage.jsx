import { REGISTER_USER } from '../graphql/mutations/registerUser.js';
import { useState } from 'react';
import { useMutation } from '@apollo/client';

function RegisterPage(){
  const[registerUser] = useMutation(REGISTER_USER);
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");
  const[passwordConfirmation, setPasswordConfirmation] = useState("");
  
  const handleRegister = async(e) => {
    e.preventDefault();
    try {
      const response = await registerUser({ variables: 
        { email: email, password: password, passwordConfirmation: passwordConfirmation }})

      if(response.data.registerUser.errors === null){
        alert("Registration succesfull!");
      }
    } catch ( err ){
      console.error(err);
    }
  }

  return(
    <div className='bg-mybg h-screen w-screen flex flex-row justify-center items-center'>
      <div className='w-100 h-100 outline-1 outline-white space-y-40'>
        <form onSubmit={handleRegister} className='text-white flex flex-col items-center space-y-2 m-2'>
          
          <input type="text" placeholder='Email'
          className='peer outline-1 outline-white bg-myBg2 w-[50%]
          placeholder:opacity-10 placeholder:text-mytext
          placeholder:transition-opacity placeholder:duration-[500ms]
          hover:placeholder:opacity-100 placeholder:p-2' 
          onChange={(e) => setEmail(e.target.value)}/>
          
          <input type="text" 
          className="peer outline-1 outline-white bg-myBg2 w-[50%]
          placeholder:opacity-10 placeholder:text-mytext
          placeholder:transition-opacity placeholder:duration-[500ms]
          hover:placeholder:opacity-100 placeholder:p-2" 
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)}/>
          
          <input type="text" 
          className="peer outline-1 outline-white bg-myBg2 w-[50%]
          placeholder:opacity-10 placeholder:text-mytext
          placeholder:transition-opacity placeholder:duration-[500ms]
          hover:placeholder:opacity-100 placeholder:p-2" 
          placeholder='Password Confirmation'
          onChange={(e) => setPasswordConfirmation(e.target.value)}/>

          <button type="submit"
          className='outline-1 outline-white bg-myBg2 w-[50%] 
          text-mytext/10 duration-[500ms] transition-colors text-left px-2
          hover:text-mytext hover:duration-[500ms] hover:transition-colors'
          > Register </button>

        </form>
      </div>
    </div>
  );
}
export default RegisterPage;