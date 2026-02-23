module Mutations
    module Users
        class LoginUser < Mutations::BaseMutation
            argument :email, String, required: true
            argument :password, String, required: true
        
            field :success, Boolean, null: false
            field :errors, [String], null: false
            field :user, Types::UserType, null: true

            def resolve(email:, password:)
                user = User.find_by(email: email)
        
                if user&.valid_password?(password)
                    auth_headers = user.create_new_auth_token
          
                    context[:cookies].signed["auth_cookie"] = {
                        value: auth_headers.to_json,
                        httponly: true,
                        secure: Rails.env.production?,
                        same_site: :none 
                    }
                    { user: user, success: true, errors: []}
                else
                    { user: nil, success: false, errors: ['Invalid credentials'] }
                end
            end
        end
    end
end     