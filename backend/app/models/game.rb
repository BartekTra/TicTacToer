class Game < ApplicationRecord
  belongs_to :player1, class_name: 'User', optional: true
  belongs_to :player2, class_name: 'User', optional: true
  belongs_to :currentturn, class_name: 'User', optional: true
  belongs_to :winner, class_name: 'User', optional: true

  validate :players_must_be_different
  
  after_update_commit do
    check_winner
    broadcast_game
    check_game_status
  end

  after_create_commit { broadcast_game }

  WIN_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]

  def broadcast_game
    ActionCable.server.broadcast("GamesChannel_#{id}", {
      id: id,
      board: board,
      player1: player1,
      player2_id: player2_id,
      currentturn: currentturn,
      winner: winner,
      movecounter: movecounter
    })
  end

  def check_winner
    return if board.nil? || board.length < 9

    WIN_COMBINATIONS.each do |combo|
      a, b, c = combo.map { |i| board[i] }
      next if [a, b, c].any? { |v| v == "0" || v == "9" }

      if a == b && b == c && winner.nil?
        winning_player = movecounter.odd? ? player1 : player2
        update(winner: winning_player)
        return
      end
    end

    if movecounter == 9 && winner.nil?
      update(winner: nil) # możesz też ustawić np. specjalny `draw` flag
    end
  end


  def check_game_status
    return if winner.nil?

    ActionCable.server.broadcast("GamesChannel_#{id}", { action: "please :)" })
    GameCleanupJob.set(wait: 5.seconds).perform_later(id)
  end

  def players_must_be_different
    if player1_id.present? && player1_id == player2_id
      errors.add(:base, "player1 i player2 nie mogą być tym samym użytkownikiem")
    end
  end
end
