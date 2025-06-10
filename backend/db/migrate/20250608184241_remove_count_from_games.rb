class RemoveCountFromGames < ActiveRecord::Migration[7.2]
  def change
        remove_column :games, :count, :string
  end
end
