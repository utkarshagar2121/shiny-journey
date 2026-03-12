import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // will hook up to AuthContext later
    console.log("logout");
    navigate("/");
  };

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
          Hi, Utkarsh
        </span>
        <button
          onClick={handleLogout}
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
