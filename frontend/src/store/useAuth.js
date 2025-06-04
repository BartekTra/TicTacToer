import { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { CHECK_AUTH } from "../graphql/queries/checkAuth.js";
import { useDispatch } from "react-redux";
import { logout } from "./authSlice.js";

const useAuth = () => {
  const[isAuthenticated, setIsAuthenticated] = useState(false);
        
  return { isAuthenticated };
}

export default useAuth;