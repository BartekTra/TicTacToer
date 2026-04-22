import { gql } from "@apollo/client";

export const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      email
      id
      name
      nickname
      classicRating
      infiniteRating
    }
  }
`;
