module Mutations
  module Game
      class AddPlayerIntoGame < Mutations::BaseMutation
        
        type Types::GameType, null: false
        
        argument :playerGuid, String, required: true
        argument :id, ID, required: true

        def resolve(playerGuid:, id:)
          game = ::Game.find(id)
          if game.player1guid == nil 
            game.player1guid = playerGuid 
          else
            game.player2guid = playerGuid
          end
          game.save
          game
        end
      end
  end
end