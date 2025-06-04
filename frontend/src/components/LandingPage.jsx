import { useNavigate } from "react-router-dom";
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLazyQuery, useMutation } from "@apollo/client";
import { CHECK_AUTH } from "../graphql/queries/checkAuth";
import { LOGIN_USER } from '../graphql/mutations/loginUser.js';
import { FETCH_ALL_GAMES } from "../graphql/queries/fetchGamesAll.js";
import { useUser } from '../context/UserContext';
import { loginSuccess } from '../store/authSlice';

function LandingPage() {
  const [loginUser] = useMutation(LOGIN_USER);
  const [checkAuth, { loading: loadingAuth, error: errorAuth, data: dataAuth }] = useLazyQuery(CHECK_AUTH, { fetchPolicy: 'network-only' });
  const [fetchAllGames, { loading: loadingAllGames, error: errorAllGames, data: dataAllGames }] = useLazyQuery(FETCH_ALL_GAMES, { fetchPolicy: 'network-only' });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading: loadingUser, setUser } = useUser();

  useEffect(() => {
    // Sprawdź użytkownika po załadowaniu
    if (!loadingUser && !user) {
      checkAuth().then(res => {
        if (res?.data?.currentUser) {
          setUser(res.data.currentUser);
        }
      }).catch(console.error);
    }
  }, [loadingUser, user, checkAuth, setUser]);

  const handleLoginTestButton = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({
        variables: { email: "testuje@wp.pl", password: "12qwaszx" }
      });

      console.log(response);

      const token = response.data.loginUser.token;
      const tempCurrentUser = JSON.parse(response.data.loginUser.token);
      const currentUser = tempCurrentUser["uid"];

      console.log(token);
      console.log(currentUser);
    
      if (token && currentUser) {
        dispatch(loginSuccess({ user: currentUser, token }));
        setUser(currentUser);
        alert("Zalogowano!");
      }
      const tempTest = JSON.parse(response.data.loginUser.token)
      console.log(tempTest["access-token"]);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleTestFetchAllGamesButton = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchAllGames();
      console.log("Fetched games:", res?.data);
    } catch (err) {
      console.error("Fetch all games error:", err);
    }
  };

  const handleTestButton = async (e) => {
    e.preventDefault();
    try {
      const response = await checkAuth();
      console.log("CheckAuth response:", response);
    } catch (err) {
      console.error("CheckAuth error:", err);
    }
  };

  const handleLoginButton = () => navigate("/login");
  const handleRegisterButton = () => navigate("/register");

  if (loadingUser) return <p>Ładowanie...</p>;

  if (!user) {
    return (
      <button onClick={handleLoginTestButton} className="bg-gray-600 active:bg-gray-800 w-15">
        LoginDebugging
      </button>
    );
  }

  return (
    <div className='bg-mybg h-screen w-screen flex flex-row justify-center items-center text-white'>
      <div className="flex flex-col">
        <p>SiemaXD</p>
        <h2>Witaj, {user.email}!</h2>

        <button onClick={handleLoginButton} className="bg-gray-600 active:bg-gray-800 w-15">
          Login
        </button>

        <button onClick={handleRegisterButton} className="bg-gray-600 active:bg-gray-800 w-15">
          Register
        </button>

        <button onClick={handleTestButton} className="bg-gray-600 active:bg-gray-800 w-15">
          TEST
        </button>

        <button onClick={handleLoginTestButton} className="bg-gray-600 active:bg-gray-800 w-15">
          LoginDebugging
        </button>

        <button onClick={handleTestFetchAllGamesButton} className="bg-gray-600 active:bg-gray-800 w-15">
          TestFetchAllGamesButton
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
