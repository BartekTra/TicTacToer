class CreateButtons < ActiveRecord::Migration[7.2]
  def change
    create_table :buttons do |t|
      t.integer :count

      t.timestamps
    end
  end
end
