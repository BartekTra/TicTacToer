class Button < ApplicationRecord
  after_update_commit { broadcast_count }

  def broadcast_count
    ActionCable.server.broadcast('ButtonsChannel', { id:, count: })
  end
end
