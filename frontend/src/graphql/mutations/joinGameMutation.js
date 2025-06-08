import { gql } from '@apollo/client';

export const JOIN_GAME = gql`
  mutation JoinGame {
      joinGame {
          message
          game {
              count
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
  }
`