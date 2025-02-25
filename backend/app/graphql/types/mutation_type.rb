# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :move, Types::GameType, null: false, 
    description: "Update the gameboard based on which cell was clicked and which players' turn it is" do
      argument :cell, Integer, required: true
      argument :id, ID, required: true
    end

    def move(cell:, id:)
      tempGame = Game.find(id)
      if tempGame.currentturn == tempGame.player1guid 
      ? tempGame.board[cell] = "O" 
      : tempGame.board[cell] = "X"
      tempGame.save
      tempGame
    end
  end
end
