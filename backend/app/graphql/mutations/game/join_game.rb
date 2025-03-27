module Mutations
  module Game
    class JoinGame < Mutations::BaseMutation

      type Types::GameType, null: false

      argument :player, String, required: true
      argument :realuuid, String, required: true

      def resolve(player:, realuuid:)
        tempGame = ::Game.order(created_at: :desc).first
        if tempGame == nil || \
          (tempGame.player2 != nil && \
          realuuid != tempGame.player1guid && \
          realuuid != tempGame.player2guid)

          game = ::Game.create(
            player1: player,
            player2: nil,
            player1guid: realuuid,
            player2guid: nil,
            currentturn: realuuid,
            winner: nil,
            count: 0,
            board: "000999000",
            movecounter: 0
          )
          game.save
          return game
        elsif realuuid == tempGame.player1guid 
          tempGame.player1 = player
        elsif realuuid == tempGame.player2guid
          tempGame.player2 = player
        else 
          tempGame.player2 = player
          tempGame.player2guid = realuuid
        end
        tempGame.save
        tempGame
      end

    end
  end
end