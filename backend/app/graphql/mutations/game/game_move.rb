module Mutations
  module Game
    class GameMove < Mutations::BaseMutation
      argument :cell, Integer, required: true

      field :success, Boolean, null: false
      field :message, String, null: false
      field :game, Types::GameTypes::GameType, null: true

      def resolve(cell:)
        user = context[:current_user]

        game = Games::MakeMove.call(user: user, cell: cell)

        {
          success: true,
          message: "Pomyślnie wykonano ruch w grze",
          game: game
        }

      rescue ActiveRecord::RecordNotFound
        raise GraphQL::ExecutionError, "Gra nie znaleziona"
      rescue Games::MakeMove::ValidationError => e
        raise GraphQL::ExecutionError, e.message
      end
    end
  end
end
