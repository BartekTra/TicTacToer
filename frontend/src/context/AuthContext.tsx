import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { CURRENT_USER } from "../graphql/queries/authorization/currentUser";
import { LOGOUT_USER } from "../graphql/mutations/authorization/logoutUser";
import { useNavigate, useLocation } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { type User } from "../types/User";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_PAGES = ["/login", "/register"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = AUTH_PAGES.includes(location.pathname);

  const { loading } = useQuery<{ currentUser: User | null }>(CURRENT_USER, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (data?.currentUser) {
        setUserState(data.currentUser);
        if (isAuthPage) {
          navigate("/");
        }
      } else if (!isAuthPage) {
        navigate("/login");
      }
    },
    onError: () => {
      if (!isAuthPage) {
        navigate("/login");
      }
    },
  });

  const [logoutMutation] = useMutation(LOGOUT_USER);

  const setUser = useCallback((newUser: User) => {
    setUserState(newUser);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation();
    } finally {
      setUserState(null);
      navigate("/login");
    }
  }, [logoutMutation, navigate]);

  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      navigate("/login");
    }
  }, [loading, user, isAuthPage, navigate]);

  if (loading && !user) {
    return <Spinner text="Ładowanie sesji..." fullScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
