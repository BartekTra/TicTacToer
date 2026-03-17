class AddGamemodeAndHistoryToGames < ActiveRecord::Migration[7.2]
  def change
    add_column :games, :game_mode, :string, default: "classic"

    add_column :games, :moves_history, :jsonb, default: []
  end
end
