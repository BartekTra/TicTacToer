import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      errors
      success
      user {
        email
        id
        name
        nickname
        infiniteRating
        classicRating
      }
    }
  }
`;
