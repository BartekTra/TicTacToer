module Types
  class GameType < Types::BaseObject
    field :id, ID, null: false
    field :player1_id, ID, null: true
    field :player2_id, ID, null: true
    field :currentturn, String, null: true
    field :winner, String, null: true
    field :count, Integer, null: true
    field :movecounter, Integer, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end