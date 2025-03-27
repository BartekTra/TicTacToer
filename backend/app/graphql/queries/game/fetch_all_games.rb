module Queries
  module Game

    class FetchAllGames < Queries::BaseQuery

      type [Types::GameType], null: false

      def resolve()
        ::Game.all
      end

    end
  end
end