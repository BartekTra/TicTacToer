module Queries
  module Game
    class FetchGamestate < Queries::BaseQuery
      type Types::GameTypes::GameType, null: false
      argument :id, ID, required: true
      
      def resolve(id:)
        ::Game.find(id)
      end
    end
  end
end