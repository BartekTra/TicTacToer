import { useLocation, Outlet } from "react-router-dom";
import Navbar from "../NavBar/NavBar";
import AuthGuard from "../../components/AuthGuard";

export default function MainLayout() {
  const location = useLocation();

  const hiddenNavbarPaths = ["/login", "/register"];

  const hideNavbar = hiddenNavbarPaths.includes(location.pathname);

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen w-screen overflow-hidden text-zinc-100">
        {!hideNavbar && <Navbar />}
        <main className="flex-1 overflow-y-auto relative w-full">
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  );
}
