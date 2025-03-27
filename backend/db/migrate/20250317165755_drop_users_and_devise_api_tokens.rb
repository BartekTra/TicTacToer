class DropUsersAndDeviseApiTokens < ActiveRecord::Migration[7.2]
  def up
    drop_table :users if table_exists?(:users)
    drop_table :devise_api_tokens if table_exists?(:devise_api_tokens)
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
