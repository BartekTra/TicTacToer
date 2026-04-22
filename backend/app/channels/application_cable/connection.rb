module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
      reject_unauthorized_connection unless current_user
    end

    private

    def find_verified_user
      return nil unless cookies["auth_cookie"].present?

      token_data = JSON.parse(cookies["auth_cookie"])
      uid = token_data["uid"]
      client_id = token_data["client"]
      token = token_data["access-token"]

      user = User.find_by(uid: uid)

      return user if user&.valid_token?(token, client_id)

      nil
    rescue JSON::ParserError
      nil
    end
  end
end
