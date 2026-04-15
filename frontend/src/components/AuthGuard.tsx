import { useEffect, type ReactNode } from 'react';
import { setCredentials } from '../features/auth/authSlice';
import { CURRENT_USER } from '../graphql/queries/authorization/currentUser';
import { useQuery } from '@apollo/client/react';
import { type User } from '../types/User';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Spinner } from './Spinner';

interface AuthGuardProps {
  children: ReactNode;
}

interface CurrentUserResponse {
  currentUser: User | null;
}

const AUTH_PAGES = ["/login", "/register"];

const AuthGuard = ({ children }: AuthGuardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);

  const isAuthPage = AUTH_PAGES.includes(location.pathname);

  const { data, loading } = useQuery<CurrentUserResponse>(CURRENT_USER, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (loading) return;

    if (data?.currentUser) {
      dispatch(setCredentials(data.currentUser));
      if (isAuthPage) {
        navigate("/");
      }
    } else if (!isAuthPage && !user && !isAuth) {
      navigate("/login");
    }
  }, [data, loading, isAuthPage, dispatch, navigate, user, isAuth]);

  if (loading) {
    return <Spinner text="Ładowanie sesji..." fullScreen />;
  }

  return children;
};

export default AuthGuard;
