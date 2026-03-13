require 'rails_helper'

RSpec.describe Mutations::Game::GameMove do
  let(:user) { create(:user) }
  let(:game) { create(:game) }
  let(:cell) { 4 }
  
  let(:context) { { current_user: user } }
  
  subject(:resolve_mutation) do
    mutation = described_class.allocate 
    allow(mutation).to receive(:context).and_return(context)
    mutation.resolve(cell: cell, id: game.id)
  end

  let(:make_move_instance) { instance_double('Games::MakeMove') }

  describe '#resolve' do
    context 'kiedy użytkownik nie jest zalogowany' do
      let(:context) { { current_user: nil } }

      it 'zwraca błąd autoryzacji' do
        expect { resolve_mutation }.to raise_error(GraphQL::ExecutionError, "Brak autoryzacji")
      end
    end

    context 'kiedy użytkownik jest zalogowany' do
      before do
        allow(Games::MakeMove).to receive(:new)
          .with(user: user, game_id: game.id, cell: cell)
          .and_return(make_move_instance)
      end

      context 'Happy Path - Poprawny ruch' do
        it 'wywołuje serwis Games::MakeMove i zwraca zaktualizowaną grę' do
          expect(make_move_instance).to receive(:call).and_return(game)
          
          result = resolve_mutation
          
          expect(result).to eq(game)
        end
      end

      context 'Sad Path - Błędy serwisu i bazy' do
        context 'kiedy gra nie istnieje' do
          before do
            allow(make_move_instance).to receive(:call).and_raise(ActiveRecord::RecordNotFound)
          end

          it 'zwraca GraphQL::ExecutionError z komunikatem "Gra nie znaleziona"' do
            expect { resolve_mutation }.to raise_error(GraphQL::ExecutionError, "Gra nie znaleziona")
          end
        end

        context 'kiedy ruch jest niedozwolony (zwraca ValidationError z serwisu)' do
          before do
            stub_const("Games::MakeMove::ValidationError", Class.new(StandardError))
            allow(make_move_instance).to receive(:call)
              .and_raise(Games::MakeMove::ValidationError.new("To pole jest już zajęte"))
          end

          it 'przekazuje błąd serwisu jako błąd GraphQL' do
            expect { resolve_mutation }.to raise_error(GraphQL::ExecutionError, "To pole jest już zajęte")
          end
        end
      end
    end
  end
end