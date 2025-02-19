class AddCountToGames < ActiveRecord::Migration[7.2]
  def change
    add_column :games, :count, :integer
  end
end
