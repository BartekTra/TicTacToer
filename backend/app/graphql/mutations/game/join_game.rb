module Mutations
  module Game
    class JoinGame < Mutations::BaseMutation
      field :game, Types::GameType, null: false
      field :message, String, null: false

      def resolve
        user = context[:current_user]
        raise GraphQL::ExecutionError, "Brak autoryzacji" unless user

        Games::JoinGame.new(user: user).call
      end
    end
  end
end