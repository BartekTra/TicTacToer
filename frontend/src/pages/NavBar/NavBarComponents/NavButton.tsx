import { Link } from "react-router-dom";

interface NavItemProps {
  to: string;
  label: string;
  isActive: boolean;
}

export const NavButton = ({ to, label, isActive }: NavItemProps) => {
  const baseStyles = "relative rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150";
  const activeStyles = isActive 
    ? "bg-white/10 text-white" 
    : "text-zinc-400 hover:bg-white/5 hover:text-white";

  return (
    <li>
      <Link to={to} className={`${baseStyles} ${activeStyles}`}>
        {isActive && (
          <span className="absolute inset-x-2 -bottom-px h-px bg-indigo-400" />
        )}
        {label}
      </Link>
    </li>
  );
};