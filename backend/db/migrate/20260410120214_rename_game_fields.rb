class RenameGameFields < ActiveRecord::Migration[7.2]
  def change
    rename_column :games, :currentturn_id, :current_turn_id
    rename_column :games, :movecounter, :move_counter
  end
end
