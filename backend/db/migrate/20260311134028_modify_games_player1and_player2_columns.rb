class ModifyGamesPlayer1andPlayer2Columns < ActiveRecord::Migration[7.2]
  def change
    remove_column :games, :player1_id
    remove_column :games, :player2_id
  end
end
