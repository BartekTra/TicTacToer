class AddPlayersToGames < ActiveRecord::Migration[7.2]
  def change
    add_reference :games, :player1, foreign_key: { to_table: :users }
    add_reference :games, :player2, foreign_key: { to_table: :users }
  end
end
