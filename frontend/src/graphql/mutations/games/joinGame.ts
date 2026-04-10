import { gql } from "@apollo/client";

export const JOIN_GAME = gql`
mutation JoinGame($gameMode: GameMode!) {
    joinGame(gameMode: $gameMode) {
        message
        game {
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
}
`
