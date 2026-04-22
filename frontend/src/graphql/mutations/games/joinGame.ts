import { gql } from "@apollo/client";

export const JOIN_GAME = gql`
  mutation JoinGame($gameMode: GameMode!) {
    joinGame(gameMode: $gameMode) {
      message
      game {
        board
        gameMode
        id
        moveCounter
        winner {
          id
          nickname
          classicRating
          infiniteRating
        }
        player2 {
          id
          nickname
          classicRating
          infiniteRating
        }
        player1 {
          id
          nickname
          classicRating
          infiniteRating
        }
      }
    }
  }
`;
