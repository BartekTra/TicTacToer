import { InputField } from "../../../../components/InputField";
import { Button } from "../../../../components/Button";
import { useState, type FormEvent } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN_USER } from "../../../../graphql/mutations/authorization/loginUser";
import { type UserLoginResponse } from "./UserLoginResponse";
import { useAppDispatch } from "../../../../app/hooks";
import { setCredentials } from "../../../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loginUser, { loading }] = useMutation<UserLoginResponse>(LOGIN_USER, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.loginUser.user) {
        dispatch(setCredentials(data.loginUser.user));
        navigate("/");
      }
    },
    onError: (error) => {
      setLoginError(error.message || "Wystąpił błąd podczas logowania.");
    },
  });

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);
    await loginUser({ variables: { email, password } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-700">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-10 bg-gray-900 rounded-lg shadow-md"
      >
        <h2 className="mb-8 text-2xl font-bold text-center text-gray-100">
          Zaloguj się
        </h2>

        {loginError && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 p-3 rounded">
            {loginError}
          </div>
        )}

        <InputField
          label="Adres e-mail"
          id="email"
          type="email"
          placeholder="jan.kowalski@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <InputField
          label="Hasło"
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-gray-100 transition duration-150 ease-in-out border-gray-300 rounded cursor-pointer focus:ring-blue-500"
              onChange={(e) => setRememberMe(e.target.checked)}
              checked={rememberMe}
            />
            <label
              htmlFor="remember"
              className="ml-2 text-sm text-gray-100 cursor-pointer"
            >
              Zapamiętaj mnie
            </label>
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Logowanie..." : "Zaloguj"}
        </Button>

        <p className="mt-6 text-sm text-center text-gray-100">
          Nie masz jeszcze konta?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-400 hover:underline"
          >
            Zarejestruj się
          </Link>
        </p>
      </form>
    </div>
  );
};
