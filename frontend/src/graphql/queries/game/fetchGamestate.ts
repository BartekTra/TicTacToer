import { gql } from '@apollo/client';

export const FETCH_GAMESTATE = gql`
  query FetchGamestate {
      fetchGamestate {
          board
          createdAt
          gameMode
          id
          moveCounter
          updatedAt
          winner {
              email
              id
              nickname
              classicRating
              infiniteRating
          }
          currentTurn {
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
