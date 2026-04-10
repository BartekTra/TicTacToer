module Types
  module GameTypes
    class GameType < Types::BaseObject
      field :id, ID, null: false
      field :player1, Types::UserTypes::PublicUserType, null: true
      field :player2, Types::UserTypes::PublicUserType, null: true
      field :current_turn, Types::UserTypes::PublicUserType, null: true
      field :winner, Types::UserTypes::PublicUserType, null: true
      field :move_counter, Integer, null: true
      field :board, String, null: false
      field :game_mode, Types::GameTypes::GameModeType, null: false
      field :created_at, GraphQL::Types::ISO8601DateTime, null: false
      field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    end
  end
end
