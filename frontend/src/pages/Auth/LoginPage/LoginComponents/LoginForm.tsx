import { InputField } from "../../../../components/InputField";
import { Button } from "../../../../components/Button";
import { useState, type FormEvent } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN_USER } from "../../../../graphql/mutations/authorization/loginUser";
import { type UserLoginResponse } from "./UserLoginResponse";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [loginUser, { loading }] = useMutation<UserLoginResponse>(LOGIN_USER, {
    fetchPolicy: "network-only",
  });

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const { data } = await loginUser({ variables: { email, password } });
      if (data?.loginUser.success && data.loginUser.user) {
        setUser(data.loginUser.user);
        navigate("/");
      } else if (data?.loginUser.errors?.length) {
        setLoginError(data.loginUser.errors.join(", "));
      } else {
        setLoginError("Nieprawidłowe dane logowania.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Wystąpił błąd podczas logowania.";
      setLoginError(message);
    }
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
