# frozen_string_literal: true

module Games
  class PayloadBuilder
    def initialize(game)
      @game = game
    end

    def build
      {
        id: @game.id.to_s,
        board: @game.board,
        player1: user_payload(@game.player1),
        player2: user_payload(@game.player2),
        currentTurn: user_payload(@game.current_turn),
        winner: user_payload(@game.winner),
        moveCounter: @game.move_counter,
        gameMode: @game.game_mode,
        createdAt: @game.created_at.iso8601,
        updatedAt: @game.updated_at.iso8601
      }
    end

    private

    def user_payload(user)
      return nil unless user

      {
        id: user.id,
        nickname: user.nickname,
        classicRating: user.classic_rating,
        infiniteRating: user.infinite_rating
      }
    end
  end
end
