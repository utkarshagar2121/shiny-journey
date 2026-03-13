import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      className="w-full px-8 py-4 flex items-center justify-between"
      style={{ backgroundColor: "#fffdf9", borderBottom: "1px solid #ede8df" }}
    >
      {/* LEFT — Logo */}
      <Link
        to="/dashboard"
        className="text-xl font-semibold"
        style={{
          color: "#5c4a32",
          fontFamily: "Georgia, serif",
          textDecoration: "none",
        }}
      >
        📖 Memoria
      </Link>

      {/* RIGHT — User + Logout */}
      <div className="flex items-center gap-4">
        <span className="text-sm" style={{ color: "#a08c72" }}>
          Hi, {user?.name.split(" ")[0] || "There"}
        </span>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide hover:opacity-80 transition-opacity"
          style={{
            backgroundColor: "#f5f0e8",
            color: "#7a6652",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
