module Mutations
  module Game
    class JoinGame < Mutations::BaseMutation
      field :game, Types::GameType, null: false
      field :message, String, null: false

      def resolve
        user = context[:current_user]
        raise GraphQL::ExecutionError, "Brak autoryzacji" unless user

        existing_game = ::Game.where("player1_id = ? OR player2_id = ?", user.id, user.id)
                              .where(winner: nil)
                              .first
        return { game: existing_game, message: "Już bierzesz udział w grze" } if existing_game

        game = ::Game.where(player1_id: nil).or(::Game.where(player2_id: nil))
                    .order(:created_at)
                    .lock("FOR UPDATE") # zabezpieczenie przed race condition
                    .first

        if game
          if game.player1_id.nil?
            game.update!(player1_id: user.id)
          elsif game.player2_id.nil?
            game.update!(player2_id: user.id)
          end
          message = "Dołączono do istniejącej gry"
        else
          game = ::Game.create!(
            player1_id: user.id,
            board: "123456789",
            currentturn_id: user.id,
            movecounter: 1,
            )
          message = "Utworzono nową grę"
        end

        { game: game, message: message }
      end
    end
  end
end