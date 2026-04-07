import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { NavButton } from "./NavBarComponents/NavButton";

const NAV_LINKS = [
  { to: "/", label: "Strona Główna" },
  { to: "/login", label: "Logowanie" },
  { to: "/register", label: "Rejestracja" },
];

export default function Navbar() {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  const handleLogout = () => {};

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-80"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500 text-sm font-black text-white">
            T
          </span>
          <span className="hidden sm:inline">TicTacToer</span>
        </Link>

        <ul className="flex items-center gap-1">
          <NavButton to={"/"} label={"Strona Główna"} isActive={location.pathname === "/"} />

          <NavButton to={"/"} label={"Gra - Classic"} isActive={location.pathname === "/game"} />

          <NavButton to={"/"} label={"Gra - Infinite"} isActive={location.pathname === "game"} />
        </ul>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-zinc-400 sm:block">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95"
          >
            Wyloguj
          </button>
        </div>
      </div>
    </nav>
  );
}
