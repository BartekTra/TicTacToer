module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
      
      # Jeśli chcesz, by aplikacja całkowicie blokowała gości (niezalogowanych) do WebSocketów,
      # odkomentuj poniższą linijkę. Jeśli goście mogą patrzeć na mecze - zostaw zakomentowane.
      # reject_unauthorized_connection unless current_user
    end

    private

    def find_verified_user
      # Odczytujemy ciasteczko ustawione przy logowaniu przez Devise Token Auth
      if cookies["auth_cookie"].present?
        begin
          token_data = JSON.parse(cookies["auth_cookie"])
          uid = token_data['uid']
          client_id = token_data['client']
          token = token_data['access-token']

          user = User.find_by(uid: uid)
          
          # Weryfikujemy, czy token z ciasteczka pokrywa się z bazą danych
          if user && user.valid_token?(token, client_id)
            return user
          end
        rescue JSON::ParserError
          # Zignoruj zepsute ciastka
        end
      end
      nil
    end
  end
end
