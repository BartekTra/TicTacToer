module Games
  module Modes
    class Infinite < Base
      private

      def apply_board_changes
        board_array = @game.board.chars
        history = @game.moves_history || []

        if history.length >= 6
          oldest_cell = history[history.length - 6]
          board_array[oldest_cell] = (oldest_cell + 1).to_s
        end

        board_array[@cell] = @mark
        new_history = history + [ @cell ]

        [ board_array, new_history ]
      end

      def determine_winner(board_array, _movecounter)
        winning_move?(board_array) ? @user.id : nil
      end
    end
  end
end
