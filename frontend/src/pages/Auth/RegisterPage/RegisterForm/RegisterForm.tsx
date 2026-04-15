import { useState, type ChangeEvent, type FormEvent } from "react";
import { InputField } from "../../../../components/InputField";
import { Button } from "../../../../components/Button";
import { useMutation } from "@apollo/client/react";
import { REGISTER_USER } from "../../../../graphql/mutations/authorization/registerUser";
import { useNavigate, Link } from "react-router-dom";
import type { User } from "../../../../types/User";

interface RegisterMutationResponseData {
  registerUser: {
    errors: string[];
    user: User;
  };
}

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [validationError, setValidationError] = useState("");

  const [registerUser, { loading, error: apolloError }] =
    useMutation<RegisterMutationResponseData>(REGISTER_USER);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
    if (validationError) setValidationError("");
  };

  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Podane hasła nie są identyczne.");
      return;
    }

    try {
      const response = await registerUser({
        variables: {
          nickname: formData.nickname,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          passwordConfirmation: formData.confirmPassword,
        },
      });

      if (response.data?.registerUser.user) {
        navigate("/login");
      }
    } catch {
      setValidationError("Wystąpił błąd podczas rejestracji. Spróbuj ponownie.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
      <form
        onSubmit={handleRegisterSubmit}
        className="w-full max-w-md p-10 bg-gray-800 rounded-lg shadow-md"
      >
        <h2 className="mb-8 text-2xl font-bold text-center text-gray-50">
          Załóż konto
        </h2>

        {(validationError || apolloError) && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/30 p-3 rounded">
            {validationError || apolloError?.message}
          </div>
        )}

        <InputField
          label="Nickname"
          id="nickname"
          type="text"
          placeholder="Twój wyświetlany nick"
          required
          value={formData.nickname}
          onChange={handleChange}
        />

        <InputField
          label="Imię"
          id="name"
          type="text"
          placeholder="Twoje imię"
          required
          value={formData.name}
          onChange={handleChange}
        />

        <InputField
          label="Adres e-mail"
          id="email"
          type="email"
          placeholder="twój@email.com"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <InputField
          label="Hasło"
          id="password"
          type="password"
          placeholder="••••••••"
          required
          value={formData.password}
          onChange={handleChange}
        />

        <InputField
          label="Powtórz hasło"
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <div className="flex items-start mb-6">
          <input
            type="checkbox"
            id="terms"
            checked={formData.terms}
            onChange={handleChange}
            className="w-4 h-4 mt-0.5 text-blue-600 transition duration-150 ease-in-out border-gray-300 rounded cursor-pointer focus:ring-blue-500"
            required
          />
          <label
            htmlFor="terms"
            className="ml-2 text-sm text-gray-400 cursor-pointer"
          >
            Akceptuję Regulamin oraz Politykę Prywatności
          </label>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Rejestrowanie..." : "Zarejestruj się"}
        </Button>

        <p className="mt-6 text-sm text-center text-gray-500">
          Masz już konto?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-400 hover:underline"
          >
            Zaloguj się
          </Link>
        </p>
      </form>
    </div>
  );
};
