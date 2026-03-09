require 'rails_helper'

RSpec.describe Mutations::Game::GameMove do
  let(:player1) { create(:user) }
  let(:player2) { create(:user) }
  let(:game) do 
    create(:game, 
      player1: player1, 
      player2: player2, 
      currentturn_id: player1.id, 
      board: "012345678", 
      movecounter: 0,
      winner: nil
    )
  end

  let(:current_user) { player1 }
  let(:cell) { 4 }

  subject(:resolve_mutation) do
    mutation = described_class.allocate 
    
    allow(mutation).to receive(:context).and_return({ current_user: current_user })
    
    mutation.resolve(cell: cell, id: game.id)
  end

  context 'Happy Path - Poprawny ruch' do
    it 'aktualizuje planszę, zmienia turę i zwiększa licznik ruchów' do
      result = resolve_mutation
      
      expect(result.board[4]).to eq("O")
      expect(result.currentturn_id).to eq(player2.id)
      expect(result.movecounter).to eq(1)
    end
  end

  context 'Sad Path - Przypadki brzegowe i błędy' do
    context 'kiedy użytkownik nie jest zalogowany' do
      let(:current_user) { nil } 

      it 'zwraca błąd autoryzacji' do
        expect { resolve_mutation }.to raise_error(GraphQL::ExecutionError, "Brak autoryzacji")
      end
    end

    context 'kiedy to nie jest kolej gracza' do
      let(:current_user) { player2 } 

      it 'zwraca błąd tury' do
        expect { resolve_mutation }.to raise_error(GraphQL::ExecutionError, "To nie jest Twoja kolej")
      end
    end

    context 'kiedy pole jest już zajęte' do
      before do
        game.update!(board: "0123X5678")
      end

      it 'zwraca błąd zajętego pola' do
        expect { resolve_mutation }.to raise_error(GraphQL::ExecutionError, "To pole jest już zajęte")
      end
    end

    context 'kiedy gra się już zakończyła' do
      before do
        game.update!(winner: player2)
      end

      it 'zwraca błąd zakończonej gry' do
        expect { resolve_mutation }.to raise_error(GraphQL::ExecutionError, "Gra już się zakończyła")
      end
    end
  end
end