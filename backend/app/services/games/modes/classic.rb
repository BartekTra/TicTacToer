module Games
  module Modes
    class Classic < Base
      private

      def apply_board_changes
        board_array = @game.board.chars
        board_array[@cell] = @mark
        
        history = @game.moves_history || []
        new_history = history + [@cell]

        [board_array, new_history]
      end

      def determine_winner(board_array, movecounter)
        if winning_move?(board_array)
          @user.id
        elsif movecounter == 9 
          nil 
        else
          nil
        end
      end
    end
  end
end