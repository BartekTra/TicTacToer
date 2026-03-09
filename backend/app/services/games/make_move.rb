module Games
  class MakeMove
    class ValidationError < StandardError; end

    def initialize(user:, game_id:, cell:)
      @user = user
      @game_id = game_id
      @cell = cell
    end

    def call
      game = ::Game.find(@game_id)
      
      validate_game_rules!(game)

      mark = (@user.id == game.player1_id) ? "O" : "X"
      
      board = game.board.chars
      board[@cell] = mark
      
      next_turn_id = (@user.id == game.player1_id) ? game.player2_id : game.player1_id

      game.update!(
        board: board.join,
        currentturn_id: next_turn_id,
        movecounter: game.movecounter + 1
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

      if game.board.chars[@cell].in?(%w[O X])
        raise ValidationError, "To pole jest już zajęte"
      end

      if game.winner.present?
        raise ValidationError, "Gra już się zakończyła"
      end

      unless game.player1.present? && game.player2.present?
        raise ValidationError, "Poczekaj na drugiego gracza"
      end
    end
  end
end