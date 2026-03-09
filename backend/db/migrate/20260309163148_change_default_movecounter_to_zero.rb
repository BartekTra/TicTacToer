class ChangeDefaultMovecounterToZero < ActiveRecord::Migration[7.2]
  def change
    change_column :games, :movecounter, :integer, :default =>0
    #Ex:- change_column("admin_users", "email", :string, :limit =>25)
  end
end
