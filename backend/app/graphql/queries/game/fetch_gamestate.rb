# frozen_string_literal: true

module Queries
  module Game
    class FetchGamestate < Queries::BaseQuery
      type Types::GameTypes::GameType, null: false

      def resolve
        game = context[:current_user].active_game

        raise GraphQL::ExecutionError, "Gra nie znaleziona" unless game

        game
      end
    end
  end
end
