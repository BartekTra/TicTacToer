// context/UserContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { CHECK_AUTH } from "../graphql/queries/checkAuth";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [checkAuth, { data, loading, error }] = useLazyQuery(CHECK_AUTH, {
    fetchPolicy: 'network-only', // zawsze trafia do serwera, nie cache
  });

  useEffect(() => {
    async function testujeTest() {
      const response = await checkAuth();
      console.log(response);
      if(response.data){
        const test = await JSON.stringify(response.data.currentUser);
        console.log(test);
        setUser(test);

      }
    }
    testujeTest();
  }, []);




  return (
    <UserContext.Provider value={{ user, loading, refetchUser: checkAuth }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
