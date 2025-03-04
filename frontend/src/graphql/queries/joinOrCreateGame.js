import { gql } from "@apollo/client";

export const JOIN_OR_CREATE_GAME = gql`
  query JoinOrCreateGame($player: String!, $realuuid: String!) {
    joinOrCreateGame(player: $player, realuuid: $realuuid) {
      currentturn
      id
      player1
      player2
      board
      winner
      player1guid
      player2guid
      movecounter
    }
  }
`;