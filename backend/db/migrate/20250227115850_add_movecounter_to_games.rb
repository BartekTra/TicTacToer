class AddMovecounterToGames < ActiveRecord::Migration[7.2]
  def change
    add_column :games, :movecounter, :Integer
  end
end
