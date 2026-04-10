module Mutations
    module Users
        class RegisterUser < Mutations::BaseMutation
            def authorized?(**_args)
              true
            end

            argument :nickname, String, required: true
            argument :name, String, required: true
            argument :email, String, required: true
            argument :password, String, required: true
            argument :password_confirmation, String, required: true

            field :user, Types::UserTypes::UserType, null: true
            field :errors, [ String ], null: false

            def resolve(email:, password:, password_confirmation:, name:, nickname:)
                user = User.new(name: name, nickname: nickname, email: email, password: password, password_confirmation: password_confirmation)

                if user.save
                { user: user, errors: [] }
                else
                { user: nil, errors: user.errors.full_messages }
                end
            end
        end
    end
end
