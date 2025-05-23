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
      console.log(response.data.currentUser.email);
      console.log(JSON.stringify(response.data.currentUser));
      const test = await JSON.stringify(response.data.currentUser);
      setUser(test);
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
