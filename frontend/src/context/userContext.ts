import { useEffect, type ReactNode } from 'react';
import { setCredentials } from '../features/auth/authSlice';
import { CURRENT_USER } from '../graphql/queries/authorization/currentUser';
import { useQuery } from '@apollo/client/react';
import { type User } from '../types/User';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';

interface UserContextProps {
  children: ReactNode;
}

interface CurrentUserResponse {
  currentUser: User | null;
  errors: string | null;
}

const UserContext = ({ children }: UserContextProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register"

  const { data, loading, error } = useQuery<CurrentUserResponse>(CURRENT_USER, {
    fetchPolicy: 'network-only', 
  });

  useEffect(() => {
    if (loading) return;

    if (data?.currentUser) {
      dispatch(setCredentials(data.currentUser));
    }

    const hasError = error || (data && !data.currentUser);
    
    if (hasError && !isAuthPage) {
      navigate("/login");
    }
  }, [data, loading, error, isAuthPage, dispatch, navigate]);

  if (loading) {
    return "Ładowanie sesji..."; 
  }

  return children;
};

export default UserContext;