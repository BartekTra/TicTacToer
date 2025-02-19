class Game < ApplicationRecord
  after_update_commit do
    broadcast_game
    check_winner
  end
  after_create_commit { broadcast_game }

  def broadcast_game
    ActionCable.server.broadcast("GamesChannel_#{id}", {
      id: id,
      board: board,
      player1: player1,
      player2: player2,
      player1guid: player1guid,
      player2guid: player2guid,
      currentturn: currentturn,
      winner: winner,
      count: count
    })
  end

  WIN_COMBINATIONS = [
    [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ],
    [ 0, 3, 6 ], [ 1, 4, 7 ], [ 2, 5, 8 ],
    [ 0, 4, 8 ], [ 2, 4, 6 ]
  ]

def check_winner
  WIN_COMBINATIONS.each do |combo|
    if (board[combo[0]] == board[combo[1]] && board[combo[1]] == board[combo[2]]) && (board[combo[0]] != "0" && board[combo[0]] != "9") 
      if winner == nil
        update(winner: board[combo[0]] == "O" ? player1guid : player2guid)
      end
    end
  end
  nil
end
end
