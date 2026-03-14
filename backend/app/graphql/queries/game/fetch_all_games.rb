module Queries
  module Game
    class FetchAllGames < Queries::BaseQuery
      type [Types::GameTypes::GameType], null: false

      def resolve()
        ::Game.all
      end
    end
  end
end