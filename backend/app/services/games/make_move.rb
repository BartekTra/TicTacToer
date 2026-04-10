module Games
  class MakeMove
    class ValidationError < StandardError; end
    def self.call(user:, cell:)
      game = user.active_game

      raise ValidationError, "Nie znaleziono aktywnej gry dla użytkownika" unless game

      strategy_class = case game.game_mode
      when "infinite" then Modes::Infinite
      when "classic"  then Modes::Classic
      else
                         raise ArgumentError, "Nieznany tryb gry: #{game.game_mode}"
      end

      game = strategy_class.new(user: user, game: game, cell: cell).call

      game
    end
  end
end
