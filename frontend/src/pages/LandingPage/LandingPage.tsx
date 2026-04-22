import { useJoinGame } from "../../hooks/useJoinGame";
import { Spinner } from "../../components/Spinner";

const LandingPage = () => {
  const { handleJoin, loading, error, clearError } = useJoinGame();

  if (loading) return <Spinner text="Dołączanie do gry..." fullScreen />;

  return (
    <div className="h-full bg-gray-900 flex items-center justify-center font-sans">
      <div className="bg-gray-800 border border-gray-700 rounded-sm shadow-2xl p-10 w-80 flex flex-col items-center text-center">
        <h1 className="text-gray-100 text-2xl font-bold uppercase tracking-widest mb-10">
          Dołącz do gry
        </h1>

        {error && (
          <div className="mb-4 w-full text-sm text-red-400 bg-red-900/30 p-3 rounded">
            {error}
            <button
              onClick={clearError}
              className="ml-2 text-red-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex flex-col gap-5 w-full">
          {(["classic", "infinite"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => handleJoin(mode)}
              disabled={loading}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-gray-200 font-semibold uppercase tracking-wider rounded-sm transition-colors border border-gray-600 focus:outline-none disabled:opacity-50"
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
