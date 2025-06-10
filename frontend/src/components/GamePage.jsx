import { useUser } from '../context/UserContext';
import { useEffect, useState, useRef } from 'react';
import { FETCH_GAMESTATE } from '../graphql/queries/fetchGamestateQuery';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { HANDLE_MOVE } from '../graphql/mutations/handleMoveMutation';
import { createConsumer } from '@rails/actioncable';

function GamePage() {
  const [ gameData, setGameData ] = useState();
  const [gameBoard, setGameBoard] = useState();
  const { id: gameId } = useParams();
  const [ winner, setWinner ] = useState("");
  const [currentTurnEmail, setCurrentTurnEmail] = useState("");

  const [fetchGamestate] = useLazyQuery(FETCH_GAMESTATE, { fetchPolicy: 'network-only' });
  const [handleMoveMutation] = useMutation(HANDLE_MOVE, { fetchPolicy: 'network-only' });

  const { user, loading: loadingUser } = useUser();
  useEffect(() => {
    console.log("GAMEPAGE USER: ", user);
  }, [user]);
  const cableRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (!gameId) return;

    async function fetchInitialState() {
      try {
        const response = await fetchGamestate({ variables: { id: gameId } });
        const data = response.data.fetchGamestate;
        setGameData(data);
        setGameBoard(data.board);
      } catch (err) {
        console.error('Błąd przy pobieraniu stanu gry:', err);
      }
    }

    fetchInitialState();

    // ActionCable initialization
    const cable = createConsumer('ws://localhost:3000/cable');
    cableRef.current = cable;

    const subscription = cable.subscriptions.create(
      { channel: 'GamesChannel', id: gameId },
      {
        connected() {
          console.log('Połączono z GamesChannel');
        },
        disconnected() {
          console.log('Rozłączono z GamesChannel');
        },
        received(data) {
          console.log('Odebrano dane z kanału:', data);
          console.log("NWM", gameBoard);
          if (data.board) {
            setGameData(data);
            setGameBoard(data.board);
            setCurrentTurnEmail(data.currentturn.email);
          }
          if(data.winner){
            setWinner(data.winner);
          }
        }
      }
    );

    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        cable.subscriptions.remove(subscriptionRef.current);
      }
    };
  }, [gameId, fetchGamestate]);

  const handleMove = async (cellIndex) => {
    try {
      await handleMoveMutation({ variables: { cell: cellIndex, id: gameId } });
    } catch (err) {
      console.error('Błąd przy wysyłaniu ruchu:', err);
    }
  };

  if (loadingUser || !user) return <p>Loading...</p>;
  if (!gameBoard) return <h1>Ładowanie...</h1>;

  return (
    <div className='bg-mybg h-screen w-screen flex flex-row justify-center items-center text-white'>
      <div className="flex flex-col items-center space-y-2">
        <p>Aktualna tura: {currentTurnEmail}</p>
        <p>WYGRANY: {winner}</p>
        <p>Witaj, {user}, gra #{gameId}</p>

        <div className="grid grid-cols-3 gap-2">
          {gameBoard.split("").map((char, index) => (
            <button
              key={index}
              onClick={() => handleMove(index)}
              className="w-24 h-24 bg-gray-800 rounded text-4xl"
            >
              {char === "O" || char === "X" ? char : ""}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GamePage;
