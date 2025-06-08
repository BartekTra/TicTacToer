module Mutations
  module Game
    class GameMove < Mutations::BaseMutation
      argument :cell, Integer, required: true
      argument :id, ID, required: true

      type Types::GameType, null: false

      def resolve(cell:, id:)
        user = context[:current_user]
        raise GraphQL::ExecutionError, "Brak autoryzacji" unless user

        game = ::Game.find(id)
        raise GraphQL::ExecutionError, "Gra nie znaleziona" unless game

        # Sprawdź, czy użytkownik bierze udział w grze
        unless [game.player1_id, game.player2_id].include?(user.id)
          raise GraphQL::ExecutionError, "Nie bierzesz udziału w tej grze"
        end

        # Sprawdź, czy ruch należy do tego użytkownika
        expected_turn = game.player1_id == user.id ? "O" : "X"
        unless game.currentturn == expected_turn
          raise GraphQL::ExecutionError, "To nie jest Twoja kolej"
        end

        # Sprawdź, czy komórka jest pusta
        if game.board[cell] != "0"
          raise GraphQL::ExecutionError, "To pole jest już zajęte"
        end

        # Wykonaj ruch
        game.board[cell] = expected_turn
        game.currentturn = expected_turn == "O" ? "X" : "O"
        game.movecounter += 1

        game.save!
        game
      end
    end
  end
end