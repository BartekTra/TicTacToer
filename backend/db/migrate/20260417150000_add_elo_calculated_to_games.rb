class AddEloCalculatedToGames < ActiveRecord::Migration[7.2]
  def change
    add_column :games, :elo_calculated, :boolean, default: false, null: false
  end
end
