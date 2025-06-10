class ChangerWinnerToReferenceInGames < ActiveRecord::Migration[7.2]
  def change
        # Usuwamy starą kolumnę winner jako string
    remove_column :games, :winner, :string

    # Dodajemy nową kolumnę winner_id jako odniesienie (może być null)
    add_reference :games, :winner, foreign_key: { to_table: :users }
  end
end
