import { gql } from '@apollo/client';

export const FETCH_GAMESTATE = gql`
  query fetchGamestate($id: ID!) {
    fetchGamestate(id: $id) {
        board
        count
        currentturn
        id
        player1
        player1guid
        player2
        player2guid
        winner
    }
  }
`