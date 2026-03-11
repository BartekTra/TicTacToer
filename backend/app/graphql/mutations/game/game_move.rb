module Mutations
  module Game
    class GameMove < Mutations::BaseMutation
      argument :cell, Integer, required: true
      argument :id, ID, required: true

      type Types::GameTypes::GameType, null: false

      def resolve(cell:, id:)
        user = context[:current_user]
        raise GraphQL::ExecutionError, "Brak autoryzacji" unless user

        Games::MakeMove.new(user: user, game_id: id, cell: cell).call
        
      rescue ActiveRecord::RecordNotFound
        raise GraphQL::ExecutionError, "Gra nie znaleziona"
      rescue Games::MakeMove::ValidationError => e
        raise GraphQL::ExecutionError, e.message
      end
    end
  end
end