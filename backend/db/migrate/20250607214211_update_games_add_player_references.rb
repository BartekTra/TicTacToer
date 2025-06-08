class UpdateGamesAddPlayerReferences < ActiveRecord::Migration[7.2]
  def change
    remove_column :games, :player1, :string
    remove_column :games, :player2, :string

    add_reference :games, :player1, foreign_key: { to_table: :users }
    add_reference :games, :player2, foreign_key: { to_table: :users }
  end
end
