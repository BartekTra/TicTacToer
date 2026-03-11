module Mutations
  module Game
    class JoinGame < Mutations::BaseMutation
      argument :game_mode, Types::GameModeType, required: true

      field :game, Types::GameType, null: false
      field :message, String, null: false

      def resolve(game_mode:)
        user = context[:current_user]
        raise GraphQL::ExecutionError, "Brak autoryzacji" unless user

        Games::JoinGame.new(user: user, game_mode: game_mode).call
      end
    end
  end
end