require 'rails_helper'

RSpec.describe Games::Modes::Classic do
  let(:player1) { create(:user) }
  let(:player2) { create(:user) }
  let(:game) do
    create(:game,
      player1: player1,
      player2: player2,
      current_turn: player1,
      board: "123456789",
      move_counter: 0,
      game_mode: "classic"
    )
  end

  describe '#call' do
    context 'poprawny ruch' do
      it 'umieszcza znak na planszy i zmienia turę' do
        result = described_class.new(user: player1, game: game, cell: 0).call

        expect(result.board[0]).to eq("O")
        expect(result.current_turn_id).to eq(player2.id)
        expect(result.move_counter).to eq(1)
      end

      it 'zapisuje ruch w historii' do
        result = described_class.new(user: player1, game: game, cell: 4).call
        expect(result.moves_history).to eq([ 4 ])
      end
    end

    context 'wygrana' do
      it 'ustawia winnera po wygrywającym ruchu' do
        game.update!(board: "OO3456789", move_counter: 3, current_turn: player1)
        result = described_class.new(user: player1, game: game, cell: 2).call

        expect(result.winner_id).to eq(player1.id)
      end
    end

    context 'remis' do
      it 'nie ustawia winnera przy pełnej planszy' do
        # Plansza z 8 ruchami, brak wygranej (XOOOXXOX9 → po ruchu: XOOOXXOXO)
        game.update!(board: "XOOOXXOX9", move_counter: 8, current_turn: player1)
        result = described_class.new(user: player1, game: game, cell: 8).call

        expect(result.winner_id).to be_nil
        expect(result.move_counter).to eq(9)
      end
    end

    context 'walidacje' do
      it 'odrzuca ruch na zajęte pole' do
        game.update!(board: "O23456789")

        expect {
          described_class.new(user: player1, game: game, cell: 0).call
        }.to raise_error(Games::ValidationError, "To pole jest już zajęte")
      end

      it 'odrzuca ruch gdy nie jest tura gracza' do
        expect {
          described_class.new(user: player2, game: game, cell: 0).call
        }.to raise_error(Games::ValidationError, "To nie jest Twoja kolej")
      end

      it 'odrzuca ruch gdy gra jest zakończona' do
        game.update!(winner: player1)

        expect {
          described_class.new(user: player2, game: game, cell: 0).call
        }.to raise_error(Games::ValidationError, "Gra już się zakończyła")
      end

      it 'odrzuca ruch gdy brakuje drugiego gracza' do
        game.update!(player2_id: nil)

        expect {
          described_class.new(user: player1, game: game, cell: 0).call
        }.to raise_error(Games::ValidationError, "Poczekaj na drugiego gracza")
      end
    end
  end
end
