import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CHECK_AUTH } from "../graphql/queries/checkAuth";
import { LOGIN_USER } from "../graphql/mutations/loginUser.js";
import { FETCH_ALL_GAMES } from "../graphql/queries/fetchGamesAll.js";
import { useUser } from "../context/UserContext";
import { loginSuccess } from "../store/authSlice";
import JoinGameButton from "./Buttons/JoinGameButton.jsx";
import { JOIN_GAME } from "../graphql/mutations/joinGameMutation.js";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../src/store/authSlice";

function LandingPage() {
  const [loginUser] = useMutation(LOGIN_USER);
  const [checkAuth, {}] = useLazyQuery(CHECK_AUTH, {
    fetchPolicy: "network-only",
  });
  const [fetchAllGames, {}] = useLazyQuery(FETCH_ALL_GAMES, {
    fetchPolicy: "network-only",
  });
  const [joinGame, {}] = useMutation(JOIN_GAME, {
    fetchPolicy: "network-only",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectCurrentUser);

  const handleLoginTestButton = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({
        variables: { email: "testuje@wp.pl", password: "12qwaszx" },
      });

      if (token && currentUser) {
        dispatch(loginSuccess({ user: currentUser, token }));
        setUser(currentUser.email);
        alert("Zalogowano!");
      }
      const tempTest = JSON.parse(response.data.loginUser.token);
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
      console.log("CheckAuth response:", response.data.currentUser);
    } catch (err) {
      console.error("CheckAuth error:", err);
    }
  };

  const handleJoinGame = async (e) => {
    e.preventDefault();
    try {
      const response = await joinGame();
      const gameId = response.data.joinGame.game.id;
      console.log(response.data.joinGame.game);
      navigate(`/game/${gameId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLoginButton = () => navigate("/login");
  const handleRegisterButton = () => navigate("/register");

  if (!user) {
    return <p> ładowanie</p>;
  }

  return (
    <div className="bg-mybg h-screen w-screen flex flex-row justify-center items-center text-white">
      <div className="flex flex-col items-center space-y-2 outline w-100 h-120 rounded-xl p-12">
        <p>{user.email}</p>

        <JoinGameButton label="Dołącz do gry!" onClickButton={handleJoinGame} />
      </div>
    </div>
  );
}

export default LandingPage;
