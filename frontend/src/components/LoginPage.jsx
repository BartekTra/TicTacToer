import { useState, useEffect } from "react";
import { LOGIN_USER } from "../graphql/mutations/loginUser.js";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../store/authSlice";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import "./Themes.css";
import { useUser } from "../context/UserContext";
import { CHECK_AUTH } from "../graphql/queries/checkAuth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser] = useMutation(LOGIN_USER);

  const dispatch = useDispatch();
  const { test } = useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  const { user, loading: loadingUser, setUser } = useUser();
  const [checkAuth, {}] = useLazyQuery(CHECK_AUTH, {
    fetchPolicy: "network-only",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({
        variables: { email: email, password: password },
      });
      const user = await response.data.loginUser.user;
      dispatch(loginSuccess({ user: user }));
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginTestButton = async (index) => {
    try {
      const response = await loginUser({
        variables: { email: `testuje${index}@wp.pl`, password: "12qwaszx" },
      });
      const user = await response.data.loginUser.user;
      dispatch(loginSuccess({ user: user }));
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="bg-mybg h-screen w-screen flex flex-row justify-center items-center text-white">
      <div className="w-100 h-100 outline-1 outline-white space-y-40">
        <div>
          <p className="text-wrap break-all"> {} </p>
          <form
            onSubmit={handleLogin}
            className="text-white flex flex-col items-center space-y-2 m-2"
          >
            <input
              type="text"
              placeholder="Email"
              className="
            peer outline-1 outline-white bg-myBg2 w-[50%]
            placeholder:opacity-10 placeholder:text-mytext
            placeholder:transition-opacity placeholder:duration-[500ms]
            hover:placeholder:opacity-100 placeholder:p-2"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="text"
              className="
            peer outline-1 outline-white bg-myBg2 w-[50%]
            placeholder:opacity-10 placeholder:text-mytext
            placeholder:transition-opacity placeholder:duration-[500ms]
            hover:placeholder:opacity-100 placeholder:p-2"
              placeholder="Hasło"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="outline-1 outline-white bg-myBg2 w-[50%] 
            text-mytext/10 duration-[500ms] transition-colors text-left px-2
            hover:text-mytext hover:duration-[500ms] hover:transition-colors hover:bg-gray-700"
            >
              {" "}
              Zaloguj się{" "}
            </button>
            <button
              onClick={() => navigate("/register")}
              className="outline-1 outline-white bg-myBg2 w-[50%] 
            text-mytext/10 duration-[500ms] transition-colors text-left px-2
            hover:text-mytext hover:duration-[500ms] hover:transition-colors hover:bg-gray-700"
            >
              Rejestracja
            </button>
          </form>
          {import.meta.env.DEV && (
            <div>
              <button onClick={() => handleLoginTestButton("")}>
                Testuje@wp.pl
              </button>
              <button onClick={() => handleLoginTestButton("2")}>
                Testuje2@wp.pl
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
