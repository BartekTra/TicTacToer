import { gql } from '@apollo/client';


export const HANDLE_MOVE = gql`
  mutation Move($cell: Int!, $id: ID!) {
    move(cell: $cell, id: $id) {
      board
    }
  }
`;
