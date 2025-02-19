class AddUsersessionToGames < ActiveRecord::Migration[7.2]
  def change
    add_column :games, :usersession, :string
  end
end
