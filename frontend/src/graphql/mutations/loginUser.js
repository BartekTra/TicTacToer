import { gql } from '@apollo/client';


export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(
        input: 
        { 
        email: $email, 
        password: $password 
        }) 
    {
        errors
        token
    }
  }
`;
