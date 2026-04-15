import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-6xl font-bold text-indigo-400 mb-4">404</h1>
      <p className="text-xl text-zinc-300 mb-2">Strona nie została znaleziona</p>
      <p className="text-sm text-zinc-500 mb-8">
        Wygląda na to, że ta strona nie istnieje lub została przeniesiona.
      </p>
      <Link
        to="/"
        className="rounded-md bg-indigo-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 active:scale-95"
      >
        Wróć na stronę główną
      </Link>
    </div>
  );
};

export default NotFoundPage;
