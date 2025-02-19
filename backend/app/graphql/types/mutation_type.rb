# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    # TODO: remove me
    field :test_field, String, null: false,
      description: "An example field added by the generator"
    def test_field
      "Hello World"
    end

    field :move, Types::GameType, null: false do
      argument :cell, Integer, required: true
      argument :id, ID, required: true
    end

    def move(cell:, id:)
      tempGame = Game.find(id)
      if tempGame.currentturn == tempGame.player1guid
        tempGame.board[cell] = "O"
        tempGame.currentturn = tempGame.player2guid
      else
        tempGame.board[cell] = "X"
        tempGame.currentturn = tempGame.player1guid
      end
      tempGame.save
      tempGame
    end
  end
end
