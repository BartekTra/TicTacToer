// context/UserContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { CHECK_AUTH } from "../graphql/queries/checkAuth";
import { useNavigate } from 'react-router-dom';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [checkAuth, { loading }] = useLazyQuery(CHECK_AUTH, {
    fetchPolicy: 'network-only', 
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function testujeTest() {
      const response = await checkAuth();
      console.log(response);
      if(response.data){
        const test = await JSON.stringify(response.data.currentUser.email);
        console.log(test);
        setUser(test);
        navigate("/");
      }
      if(!response.data);{
        navigate("/login");
      }
    }
    testujeTest();
  }, []);




  return (
    <UserContext.Provider value={{ user, loading, refetchUser: checkAuth, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);


