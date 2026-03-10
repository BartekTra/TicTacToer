import { InputField } from "../../../../components/InputField";
import { Button } from "../../../../components/Button";
export const LoginForm = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <form className="w-full max-w-sm p-10 bg-white rounded-lg shadow-md">
        <h2 className="mb-8 text-2xl font-bold text-center text-gray-900">
          Zaloguj się
        </h2>

        <InputField
          label="Adres e-mail"
          id="email"
          type="email"
          placeholder="jan.kowalski@example.com"
          required
        />

        <InputField
          label="Hasło"
          id="password"
          type="password"
          placeholder="••••••••"
          required
        />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 text-blue-600 transition duration-150 ease-in-out border-gray-300 rounded cursor-pointer focus:ring-blue-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 text-sm text-gray-600 cursor-pointer"
            >
              Zapamiętaj mnie
            </label>
          </div>
          <a
            href="/reset-password"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Zapomniałeś hasła?
          </a>
        </div>

        <Button type="submit">Zaloguj</Button>

        <p className="mt-6 text-sm text-center text-gray-500">
          Nie masz jeszcze konta?{" "}
          <a
            href="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Zarejestruj się
          </a>
        </p>
      </form>
    </div>
  );
};
