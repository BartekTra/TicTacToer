module Games
  module Modes
    class Base
      WIN_COMBINATIONS = [
        [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ],
        [ 0, 3, 6 ], [ 1, 4, 7 ], [ 2, 5, 8 ],
        [ 0, 4, 8 ], [ 2, 4, 6 ]
      ].freeze

      def initialize(user:, game:, cell:)
        @user = user
        @game = game
        @cell = cell
        @mark = (@user.id == @game.player1_id) ? "O" : "X"
      end

      def call
        validate_game_rules!

        board_array, new_history = apply_board_changes

        next_turn_id = (@user.id == @game.player1_id) ? @game.player2_id : @game.player1_id
        new_move_counter = @game.move_counter.to_i + 1

        winner_id = determine_winner(board_array, new_move_counter)

        @game.update!(
          board: board_array.join,
          moves_history: new_history,
          current_turn_id: next_turn_id,
          move_counter: new_move_counter,
          winner_id: winner_id
        )

        @game
      end

      private

      def apply_board_changes
        raise NotImplementedError, "Klasa dziedzicząca musi zaimplementować tę metodę"
      end

      def determine_winner(board_array, move_counter)
        raise NotImplementedError, "Klasa dziedzicząca musi zaimplementować tę metodę"
      end

      def validate_game_rules!
        raise Games::ValidationError, "Nie bierzesz udziału w tej grze" unless [ @game.player1_id, @game.player2_id ].include?(@user.id)

        raise Games::ValidationError, "To nie jest Twoja kolej" unless @game.current_turn_id == @user.id

        raise Games::ValidationError, "To pole jest już zajęte" if @game.board.chars[@cell].in?(%w[O X])

        raise Games::ValidationError, "Gra już się zakończyła" if @game.winner.present?

        raise Games::ValidationError, "Poczekaj na drugiego gracza" unless @game.player1.present? && @game.player2.present?
      end

      def winning_move?(board_array)
        WIN_COMBINATIONS.any? do |combo|
          values = combo.map { |i| board_array[i] }
          values.uniq.one? && values.first.in?(%w[X O])
        end
      end
    end
  end
end
