import { LoginForm } from "./LoginComponents/LoginForm";
import { LOGIN_USER } from "../../../graphql/mutations/authorization/loginUser";
import { useMutation } from "@apollo/client/react";
import { type UserLoginResponse } from "./LoginComponents/UserLoginResponse";
import { setCredentials } from "../../../features/auth/authSlice";
import { useAppDispatch } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
