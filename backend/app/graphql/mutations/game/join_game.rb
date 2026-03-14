module Mutations
  module Game
    class JoinGame < Mutations::BaseMutation
      argument :game_mode, Types::GameTypes::GameModeType, required: true

      field :game, Types::GameTypes::GameType, null: false
      field :message, String, null: false

      def resolve(game_mode:)
        user = context[:current_user]
        
        unless user
          raise GraphQL::ExecutionError, "Brak autoryzacji" 
        end

        Games::JoinGame.new(user: user, game_mode: game_mode).call
      end
    end
  end
end