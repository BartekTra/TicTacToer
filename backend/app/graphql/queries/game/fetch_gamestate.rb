module Queries
  module Game
    class FetchGamestate < Queries::BaseQuery
      type Types::GameTypes::GameType, null: false

      def resolve
        user = context[:current_user]

        @game = user.games_as_player1 ? user.games_as_player1 : user.games_as_player2
      end
    end
  end
end
