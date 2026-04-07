import { useLocation, Outlet } from "react-router-dom";
import Navbar from "../NavBar/NavBar";
import UserContext from "../../context/userContext";

export default function MainLayout() {
  const location = useLocation();

  const hiddenNavbarPaths = ["/login", "/register"];

  const hideNavbar = hiddenNavbarPaths.includes(location.pathname);

  return (
    <UserContext>
      <div className="flex flex-col h-screen w-screen overflow-hidden text-zinc-100">
        {!hideNavbar && <Navbar />}
        <main className="flex-1 overflow-y-auto relative w-full">
          <Outlet />
        </main>
      </div>
    </UserContext>
  );
}
