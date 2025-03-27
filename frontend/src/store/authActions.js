import { gql } from '@apollo/client';
import { logout } from './authSlice.js';
import client from '../apolloClient'; // Import instancji ApolloClient

const LOGOUT_MUTATION = gql`
  mutation LogoutUser {
    logoutUser
  }
`;

export const logoutUser = () => async (dispatch) => {
  try {
    await client.mutate({ mutation: LOGOUT_MUTATION });

    dispatch(logout());
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
