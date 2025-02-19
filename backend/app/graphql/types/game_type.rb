module Types
  class GameType < Types::BaseObject
    field :id, ID, null: false
    field :board, String
    field :player1, String
    field :player2, String
    field :currentturn, String
    field :winner, String
    field :count, Integer
    field :player1guid, String
    field :player2guid, String

  end
end