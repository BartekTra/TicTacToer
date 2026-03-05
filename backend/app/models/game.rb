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
  
  WIN_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]

  def check_winner
    return unless valid_board?

    WIN_COMBINATIONS.each do |combo|
      next unless winning_combo?(combo)

      assign_winner(current_player)
      return
    end

    declare_draw if board_full? && winner.nil?
  end

  private

  def valid_board?
    board.present? && board.length >= 9
  end

  def winning_combo?(combo)
    values = combo.map { |i| board[i] }
    return false if values.any? { |v| v.in?(%w[0 9]) }

    values.uniq.one?
  end

  def current_player
    movecounter.odd? ? player1 : player2
  end

  def assign_winner(player)
    update(winner: player) if winner.nil?
  end

  def board_full?
    movecounter == 9
  end

  def declare_draw
    update(winner: nil)
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
