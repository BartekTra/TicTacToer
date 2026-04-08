
module Games
  class MakeMove
    class ValidationError < StandardError; end
    def self.call(user:, cell:)
      game = user.games_as_player1 ? user.games_as_player1 : user.games_as_player2

      strategy_class = case game.game_mode
      when "infinite" then Modes::Infinite
      when "classic"  then Modes::Classic
      else
                         raise ArgumentError, "Nieznany tryb gry: #{game.mode}"
      end

      game = strategy_class.new(user: user, game: game, cell: cell).call

      if game.winner_id.present?
        Ratings::CalculateElo.new(game).call
      elsif game.game_mode == "classic" && game.movecounter == 9
        Ratings::CalculateElo.new(game, is_draw: true).call
      end

      game
    end
  end
end

