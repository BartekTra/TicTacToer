
module Games
  class MakeMove
    class ValidationError < StandardError; end
    def self.call(user:, game_id:, cell:)
      game = ::Game.find(game_id)
      
      strategy_class = case game.game_mode
                       when "infinite" then Modes::Infinite
                       when "classic"  then Modes::Classic
                       else 
                         raise ArgumentError, "Nieznany tryb gry: #{game.mode}"
                       end
                       
      strategy_class.new(user: user, game: game, cell: cell).call
    end
  end
end