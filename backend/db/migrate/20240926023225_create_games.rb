class CreateGames < ActiveRecord::Migration[7.2]
  def change
    create_table :games do |t|
      t.string :board
      t.string :player1
      t.string :player2
      t.string :currentturn
      t.string :winner

      t.timestamps
    end
  end
end
