
import { gql } from '@apollo/client';

export const FETCH_GAMESTATE = gql`
  query FetchGamestate {
      fetchGamestate {
          board
          createdAt
          gameMode
          id
          movecounter
          updatedAt
          winner
          currentturn {
              email
              id
              nickname
              classicRating
              infiniteRating
          }
          player2 {
              email
              id
              nickname
              classicRating
              infiniteRating
          }
          player1 {
              email
              id
              nickname
              classicRating
              infiniteRating
          }
      }
  }
`
