import { gql } from '@apollo/client';

export const FETCH_GAMESTATE = gql`
  query fetchGamestate($id: ID!) {
    fetchGamestate(id: $id) {
        createdAt
        currentturn
        id
        movecounter
        player1
        player2
        updatedAt
        winner
        board
    }
  }
`