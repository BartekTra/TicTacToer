class UpdateSchemaDropPostsButtonsAndRemovePlayerGuids < ActiveRecord::Migration[7.2]
  def change
    drop_table :posts
    drop_table :buttons

    remove_column :games, :player1guid, :string
    remove_column :games, :player2guid, :string
  end
end
