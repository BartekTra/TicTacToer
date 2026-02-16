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

        unless [game.player1_id, game.player2_id].include?(user.id)
          raise GraphQL::ExecutionError, "Nie bierzesz udziału w tej grze"
        end

        unless game.currentturn_id == user.id
          raise GraphQL::ExecutionError, "To nie jest Twoja kolej"
        end

        board = game.board.chars
        raise GraphQL::ExecutionError, "To pole jest już zajęte" if board[cell] == "O" or board[cell] == "X"

        unless game.winner == nil
          raise GraphQL::ExecutionError, "Gra już się zakończyła"
        end

        unless game.player1 != nil && game.player2 != nil
          raise GraphQL::ExecutionError, "Poczekaj na drugiego gracza"
        end

        mark = user.id == game.player1_id ? "O" : "X"
        board[cell] = mark
        game.board = board.join

        next_turn_id = user.id == game.player1_id ? game.player2_id : game.player1_id
        game.currentturn_id = next_turn_id

        game.movecounter = game.movecounter.to_i + 1

        game.save!
        game
      end
    end
  end
end
