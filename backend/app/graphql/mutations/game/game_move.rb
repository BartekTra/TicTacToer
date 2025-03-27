module Mutations
    module Game
        class GameMove < Mutations::BaseMutation
            argument :cell, Integer, required: true
            argument :id, ID, required: true

            type Types::GameType, null: false

            def resolve(cell:, id:)
                tempGame = Game.find(id)
                if tempGame.currentturn == tempGame.player1guid 
                tempGame.board[cell] = "O"
                tempGame.currentturn = tempGame.player2guid 
                else 
                tempGame.board[cell] = "X"
                tempGame.currentturn = tempGame.player1guid
                end
                tempGame.movecounter += 1
                tempGame.save
                tempGame
            end
        end
    end
end