class RemoveUsersessionFromGames < ActiveRecord::Migration[7.2]
  def change
    remove_column :games, :usersession
  end
end
