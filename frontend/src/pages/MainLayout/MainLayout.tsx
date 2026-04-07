import { useLocation, Outlet } from "react-router-dom";
import Navbar from "../NavBar/NavBar";
import UserContext from "../../context/userContext";

export default function MainLayout() {
  const location = useLocation();

  const hiddenNavbarPaths = ["/login", "/register"];

  const hideNavbar = hiddenNavbarPaths.includes(location.pathname);

  return (
    <UserContext>
      <div className="h-screen w-screen overflow-hidden">
        {!hideNavbar && <Navbar />}
        <Outlet />
      </div>
    </UserContext>
  );
}
