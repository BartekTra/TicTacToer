module Types
  module GameTypes
    class GameType < Types::BaseObject
      field :id, ID, null: false
      field :player1, Types::UserTypes::PublicUserType, null: true
      field :player2, Types::UserTypes::PublicUserType, null: true
      field :currentturn, Types::UserTypes::PublicUserType, null: true
      field :winner, String, null: true
      field :movecounter, Integer, null: true
      field :board, String, null: false
      field :game_mode, Types::GameTypes::GameModeType, null: false
      field :created_at, GraphQL::Types::ISO8601DateTime, null: false
      field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    end
  end
end
