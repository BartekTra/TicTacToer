module Ratings
  class CalculateElo
    K_FACTOR = 32.0

    def initialize(game, is_draw: false)
      @game = game
      @is_draw = is_draw
    end

    def call
      return unless @game.player1 && @game.player2

      mode = @game.game_mode
      return unless mode.in?(%w[classic infinite])

      rating_column = "#{mode}_rating".to_sym

      p1_rating = @game.player1.send(rating_column)
      p2_rating = @game.player2.send(rating_column)

      p1_expected = 1.0 / (1.0 + 10.0**((p2_rating - p1_rating) / 400.0))
      p2_expected = 1.0 / (1.0 + 10.0**((p1_rating - p2_rating) / 400.0))

      if @is_draw
        p1_actual = 0.5
        p2_actual = 0.5
      else
        p1_actual = (@game.winner_id == @game.player1_id) ? 1.0 : 0.0
        p2_actual = (@game.winner_id == @game.player2_id) ? 1.0 : 0.0
      end

      new_p1_rating = (p1_rating + K_FACTOR * (p1_actual - p1_expected)).round
      new_p2_rating = (p2_rating + K_FACTOR * (p2_actual - p2_expected)).round

      User.transaction do
        @game.player1.update!(rating_column => new_p1_rating)
        @game.player2.update!(rating_column => new_p2_rating)
      end
    end
  end
end
