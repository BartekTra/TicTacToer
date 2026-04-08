class AddRatingsToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :classic_rating, :integer, default: 1000
    add_column :users, :infinite_rating, :integer, default: 1000
  end
end
