require 'rails_helper'

RSpec.describe Games::MakeMove do
  let(:player1) { create(:user) }
  let(:player2) { create(:user) }

  describe '.call' do
    context 'tryb classic' do
      let!(:game) do
        create(:game,
          player1: player1,
          player2: player2,
          current_turn: player1,
          board: "123456789",
          move_counter: 0,
          game_mode: "classic"
        )
      end

      it 'wykonuje ruch i zwraca grę' do
        result = described_class.call(user: player1, cell: 0)

        expect(result).to be_a(Game)
        expect(result.board[0]).to eq("O")
      end

      it 'emituje event game.move_made po zwykłym ruchu' do
        allow(ActiveSupport::Notifications).to receive(:instrument).and_call_original
        expect(ActiveSupport::Notifications).to receive(:instrument)
          .with("game.move_made", hash_including(game: an_instance_of(Game)))

        described_class.call(user: player1, cell: 0)
      end

      it 'emituje event game.finished po wygrywającym ruchu' do
        game.update!(board: "OO3456789", move_counter: 4, current_turn: player1)

        allow(ActiveSupport::Notifications).to receive(:instrument).and_call_original
        expect(ActiveSupport::Notifications).to receive(:instrument)
          .with("game.finished", hash_including(game: an_instance_of(Game)))

        described_class.call(user: player1, cell: 2)
      end

      it 'emituje event game.finished po remisie (9 ruch classic)' do
        game.update!(board: "XOOOXXOX9", move_counter: 8, current_turn: player1)

        allow(ActiveSupport::Notifications).to receive(:instrument).and_call_original
        expect(ActiveSupport::Notifications).to receive(:instrument)
          .with("game.finished", hash_including(game: an_instance_of(Game)))

        described_class.call(user: player1, cell: 8)
      end
    end

    context 'tryb infinite' do
      let!(:game) do
        create(:game,
          player1: player1,
          player2: player2,
          current_turn: player1,
          board: "123456789",
          move_counter: 0,
          game_mode: "infinite"
        )
      end

      it 'deleguje do strategii Infinite' do
        result = described_class.call(user: player1, cell: 0)
        expect(result.board[0]).to eq("O")
      end
    end

    context 'brak aktywnej gry' do
      it 'rzuca RecordNotFound' do
        expect {
          described_class.call(user: player1, cell: 0)
        }.to raise_error(NoMethodError)
      end
    end

    context 'nieznany tryb gry' do
      let!(:game) do
        create(:game,
          player1: player1,
          player2: player2,
          current_turn: player1,
          board: "123456789",
          move_counter: 0
        )
      end

      it 'rzuca ArgumentError dla nieznanego trybu' do
        game.update_column(:game_mode, "unknown")

        expect {
          described_class.call(user: player1, cell: 0)
        }.to raise_error(ArgumentError, /Nieznany tryb gry/)
      end
    end
  end
end
