module Games
  class MakeMove
    class ValidationError < StandardError; end

    WIN_COMBINATIONS = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ].freeze

    def initialize(user:, game_id:, cell:)
      @user = user
      @game_id = game_id
      @cell = cell
    end

    def call
      game = ::Game.find(@game_id)
      
      validate_game_rules!(game)

      board_array = game.board.chars
      mark = (@user.id == game.player1_id) ? "O" : "X"
      board_array[@cell] = mark
      
      next_turn_id = (@user.id == game.player1_id) ? game.player2_id : game.player1_id
      new_movecounter = game.movecounter.to_i + 1
      
      winner_id = determine_winner_id(board_array)

      game.update!(
        board: board_array.join,
        currentturn_id: next_turn_id,
        movecounter: new_movecounter,
        winner_id: winner_id
      )

      game
    end

    private

    def validate_game_rules!(game)
      unless [game.player1_id, game.player2_id].include?(@user.id)
        raise ValidationError, "Nie bierzesz udziału w tej grze"
      end

      unless game.currentturn_id == @user.id
        raise ValidationError, "To nie jest Twoja kolej"
      end

      if game.board.chars[@cell].in?(["O", "X"])
        raise ValidationError, "To pole jest już zajęte"
      end

      if game.winner.present?
        raise ValidationError, "Gra już się zakończyła"
      end

      unless game.player1.present? && game.player2.present?
        raise ValidationError, "Poczekaj na drugiego gracza"
      end
    end

    def determine_winner_id(board_array)
      if winning_move?(board_array)
        @user.id
      else
        nil 
      end
    end

    def winning_move?(board_array)
      WIN_COMBINATIONS.any? do |combo|
        values = combo.map { |i| board_array[i] }
        values.uniq.one? && values.first.in?(%w[X O])
      end
    end
  end
end