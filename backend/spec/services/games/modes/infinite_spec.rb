require 'rails_helper'

RSpec.describe Games::Modes::Infinite do
  let(:player1) { create(:user) }
  let(:player2) { create(:user) }
  let(:game) do
    create(:game,
      player1: player1,
      player2: player2,
      current_turn: player1,
      board: "123456789",
      move_counter: 0,
      moves_history: [],
      game_mode: "infinite"
    )
  end

  describe '#call' do
    context 'poprawny ruch' do
      it 'umieszcza znak na planszy' do
        result = described_class.new(user: player1, game: game, cell: 0).call

        expect(result.board[0]).to eq("O")
        expect(result.current_turn_id).to eq(player2.id)
      end
    end

    context 'usuwanie najstarszego ruchu (po 6 ruchach w historii)' do
      it 'usuwa ruch sprzed 6 tur z planszy' do
        # 6 ruchów w historii: [0,3,1,4,2,5] → najstarszy = 0
        game.update!(
          board: "OXO456OX9",
          moves_history: [0, 3, 1, 4, 2, 5],
          move_counter: 6,
          current_turn: player1
        )

        # Gracz 1 stawia na 6 → powinno usunąć pozycję 0 (history[6-6]=history[0]=0)
        result = described_class.new(user: player1, game: game, cell: 8).call

        # Pole 0 powinno zostać zresetowane do "1" (index+1)
        expect(result.board[0]).to eq("1")
        # Nowy ruch na polu 8
        expect(result.board[8]).to eq("O")
      end
    end

    context 'wygrana' do
      it 'ustawia winnera' do
        game.update!(board: "OO3456789", move_counter: 3, current_turn: player1)
        result = described_class.new(user: player1, game: game, cell: 2).call

        expect(result.winner_id).to eq(player1.id)
      end
    end

    context 'gra trwa dalej bez limitu ruchów' do
      it 'pozwala na więcej niż 9 ruchów' do
        game.update!(
          board: "OXO456OX9",
          moves_history: [0, 3, 1, 4, 2, 5],
          move_counter: 10,
          current_turn: player1
        )

        expect {
          described_class.new(user: player1, game: game, cell: 8).call
        }.not_to raise_error
      end
    end
  end
end
