class AddPlayersGuidToGames < ActiveRecord::Migration[7.2]
  def change
    add_column :games, :player1guid, :string
    add_column :games, :player2guid, :string
  end
end
