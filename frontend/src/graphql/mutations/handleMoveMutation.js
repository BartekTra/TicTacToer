import { gql } from '@apollo/client';


export const HANDLE_MOVE = gql`
  mutation gameMove($cell: Int!, $id: ID!) {
    gameMove(cell: $cell, id: $id) {
        createdAt
        currentturn
        id
        movecounter
        player1Id
        player2Id
        updatedAt
        winner
    }
  }
`;
