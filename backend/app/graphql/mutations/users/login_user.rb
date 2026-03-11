module Mutations
    module Users
        class LoginUser < Mutations::BaseMutation
            argument :email, String, required: true
            argument :password, String, required: true
        
            field :success, Boolean, null: false
            field :errors, [String], null: false
            field :user, Types::UserTypes::UserType, null: true

            def resolve(email:, password:)
                user = User.find_by(email: email)
        
                if user&.valid_password?(password)
                    token = user.create_new_auth_token
          
                    context[:cookies]["auth_cookie"] = {
                                value: {
                                'access-token' => token['access-token'],
                                'client' => token['client'],
                                'uid' => token['uid']
                                }.to_json,
                                httponly: true,
                                secure: Rails.env.production?,
                                same_site: Rails.env.production? ? :none : :lax,
                                expires: 2.weeks.from_now
                            }
                    { user: user, success: true, errors: []}
                else
                    { user: nil, success: false, errors: ['Invalid credentials'] }
                end
            end
        end
    end
end     