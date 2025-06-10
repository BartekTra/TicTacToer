class ChangeCurrentturnToReferenceInGames < ActiveRecord::Migration[7.2]
  def change
    remove_column :games, :currentturn, :string

    add_reference :games, :currentturn, foreign_key: { to_table: :users }
  end
end
