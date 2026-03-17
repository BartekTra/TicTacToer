module Mutations
  module Game
    class GameMove < Mutations::BaseMutation
      
      argument :cell, Integer, required: true

      field :success, Boolean, null: false
      field :message, String, null: false

      def resolve(cell:)
        user = context[:current_user]
        raise GraphQL::ExecutionError, "Brak autoryzacji" unless user
        
        Games::MakeMove.call(user: user, cell: cell)
        
        { 
          success: true, 
          message: "Pomyślnie wykonano ruch w grze" 
        }

      rescue ActiveRecord::RecordNotFound
        raise GraphQL::ExecutionError, "Gra nie znaleziona"
      rescue Games::MakeMove::ValidationError => e
        raise GraphQL::ExecutionError, e.message
      end
    end
  end
end