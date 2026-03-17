class ChangeBoardDefaultInGames < ActiveRecord::Migration[7.2]
  def change
    change_column_default :games, :board, from: nil, to: "123456789"
  end
end
