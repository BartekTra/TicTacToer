// context/UserContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { CHECK_AUTH } from "../graphql/queries/checkAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [checkAuth, { loading }] = useLazyQuery(CHECK_AUTH, {
    fetchPolicy: "network-only",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await checkAuth();
        console.log("UserContext 22", response);
        const user = response.data.currentUser;
        dispatch(loginSuccess({ user: user }));
        navigate("/");
      } catch (error) {
        console.error(error);
        {
          location.pathname !== "/register" && navigate("/login");
        }
      }
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, refetchUser: checkAuth, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
