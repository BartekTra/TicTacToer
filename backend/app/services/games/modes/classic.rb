module Games
  module Modes
    class Classic < Base
      private

      def apply_board_changes
        board_array = @game.board.chars
        board_array[@cell] = @mark

        history = @game.moves_history || []
        new_history = history + [ @cell ]

        [ board_array, new_history ]
      end

      def determine_winner(board_array, move_counter)
        if winning_move?(board_array)
          @user.id
        elsif move_counter == ::Game::MAX_MOVES
          nil
        else
          nil
        end
      end
    end
  end
end
