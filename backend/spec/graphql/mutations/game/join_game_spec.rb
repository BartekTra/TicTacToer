require 'rails_helper'

RSpec.describe Mutations::Game::JoinGame do
  let(:user) { create(:user) }
  let(:game) { create(:game) }
  let(:context) { { current_user: user } }
  let(:game_mode) { "classic" "infinite" }
  GAME_MODES = %w[classic infinite]
  subject(:resolve_mutation) do
    mutation = described_class.allocate 
    allow(mutation).to receive(:context).and_return(context)
    mutation.resolve(game_mode: game_mode)
  end

  describe '#resolve' do
    context 'użytownik nie jest zalogowany - brak autoryzacji' do
      GAME_MODES.each do |mode|
        context "dla trybu gry -> #{mode}" do
          let(:context) { { current_user: nil } }
          let(:game_mode) { mode }

          it 'zwraca błąd brak autoryzacji' do 
            expect { resolve_mutation }.to raise_error(
              GraphQL::ExecutionError, "Brak autoryzacji"
            )
          end

        end
      end
    end

    context 'użytkownik jest zalogowany + nie jest w żadnej grze' do
      GAME_MODES.each do |mode|
        context "dla trybu gry -> #{mode}" do 
          let(:context) { { current_user: user } } 
          let(:game_mode) { mode }

          it 'zwracą nowo utworzoną rozgrywkę i użytkownika jako player1' do 

            result = resolve_mutation
            expect(result).to eq(game)
          end
        end
      end
    end
  end
end