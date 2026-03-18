import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../api/useApi";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function EntryCard({ entry, onClick }) {
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => onClick(), 300);
  };

  const preview = entry.blocks?.find((b) => b.type === "text");

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl shadow-sm overflow-hidden cursor-pointer"
      style={{
        backgroundColor: "#fffdf9",
        breakInside: "avoid",
        marginBottom: "16px",
        transition:
          "transform 0.3s ease, opacity 0.3s ease, box-shadow 0.25s ease",
        transform: clicked
          ? "scale(0.97)"
          : hovered
            ? "translateY(-4px) scale(1.01)"
            : "scale(1)",
        opacity: clicked ? 0 : 1,
        boxShadow:
          hovered && !clicked
            ? "0 8px 24px rgba(92,74,50,0.1)"
            : "0 1px 4px rgba(92,74,50,0.06)",
      }}
    >
      <div className="p-5">
        <p
          className="text-xs tracking-widest uppercase mb-2"
          style={{ color: "#b0997c" }}
        >
          {formatDate(entry.createdAt)}
        </p>
        <h3
          className="text-base font-semibold mb-2 leading-snug"
          style={{ color: "#5c4a32", fontFamily: "Georgia, serif" }}
        >
          {entry.title}
        </h3>
        {preview && (
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "#7a6652",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {preview.value}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const api = useApi();
  // eslint-disable-next-line no-unused-vars
  const { user, accessToken } = useAuth();

  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEntries = async (searchTerm = "", pageNum = 1) => {
    // console.log("fetching the entries of access token", accessToken);
    setLoading(true);
    setError(null);
    try {
      // console.log("try here");
      const res = await api.get("/journal/myentries", {
        params: { search: searchTerm, page: pageNum, limit: 9 },
      });
      // console.log("journal response ", res);
      setEntries(res.data.entries);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.log(err);
      setError("Failed to load entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      // ← only fetch when token is ready
      fetchEntries();
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    const timer = setTimeout(() => {
      fetchEntries(search, 1);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, accessToken]);

  return (
    <div
      className="flex flex-col"
      style={{ backgroundColor: "#faf7f2", minHeight: "100vh" }}
    >
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-semibold"
              style={{ color: "#5c4a32", fontFamily: "Georgia, serif" }}
            >
              Your Journal
            </h1>
            <p className="text-sm mt-1" style={{ color: "#a08c72" }}>
              {loading ? "Loading..." : `${entries.length} entries`}
            </p>
          </div>
          <button
            onClick={() => navigate("/create")}
            className="px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "#c4a882",
              color: "#fffdf9",
              border: "none",
              cursor: "pointer",
            }}
          >
            + New Entry
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search your entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-xl text-sm outline-none"
            style={{
              backgroundColor: "#fffdf9",
              color: "#5c4a32",
              border: "1px solid #ede8df",
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-sm py-10" style={{ color: "#b04040" }}>
            {error}
          </p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div
            className="masonry"
            style={{ columnCount: 3, columnGap: "16px" }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl"
                style={{
                  backgroundColor: "#fffdf9",
                  height: i % 2 === 0 ? "180px" : "140px",
                  marginBottom: "16px",
                  breakInside: "avoid",
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && entries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p
              className="text-lg mb-2"
              style={{ color: "#a08c72", fontFamily: "Georgia, serif" }}
            >
              {search ? "No entries found" : "No entries yet"}
            </p>
            <p className="text-sm mb-6" style={{ color: "#b0997c" }}>
              {search
                ? "Try a different search"
                : "Start writing your first entry"}
            </p>
            {!search && (
              <button
                onClick={() => navigate("/create")}
                className="px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: "#c4a882",
                  color: "#fffdf9",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                + New Entry
              </button>
            )}
          </div>
        )}

        {/* Masonry grid */}
        {!loading && entries.length > 0 && (
          <div
            className="masonry"
            style={{ columnCount: 3, columnGap: "16px" }}
          >
            {entries.map((entry) => (
              <EntryCard
                key={entry._id}
                entry={entry}
                onClick={() => navigate(`/entry/${entry._id}`)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => {
                setPage((p) => p - 1);
                fetchEntries(search, page - 1);
              }}
              disabled={page === 1}
              className="px-4 py-2 rounded-full text-sm hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: "#f5f0e8",
                color: "#7a6652",
                border: "none",
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.4 : 1,
              }}
            >
              ← Prev
            </button>
            <span className="text-sm" style={{ color: "#a08c72" }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => {
                setPage((p) => p + 1);
                fetchEntries(search, page + 1);
              }}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-full text-sm hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: "#f5f0e8",
                color: "#7a6652",
                border: "none",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.4 : 1,
              }}
            >
              Next →
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
