import { gql } from '@apollo/client';

export const FETCH_ALL_GAMES=gql`
  query fetchAllGames() {
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
        movecounter
    }
  }
`