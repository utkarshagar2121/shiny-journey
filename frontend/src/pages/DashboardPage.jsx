import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const dummyEntries = [
  {
    _id: "1",
    title: "A quiet morning in the hills",
    content:
      "Woke up early today. The mist was still settling over the valley when I stepped outside with my coffee. There's something about mornings like these that make everything feel possible.",
    createdAt: "2026-03-10",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      },
    ],
  },
  {
    _id: "2",
    title: "Thoughts on slowing down",
    content:
      "Been thinking a lot about pace lately. Not just physical pace, but the pace of thought, of conversation, of decision making.",
    createdAt: "2026-03-08",
    media: [],
  },
  {
    _id: "3",
    title: "The bookshop on 5th",
    content:
      "Found a tiny bookshop tucked between a laundry and a bakery. Spent two hours in there. Left with four books I didn't plan to buy and zero regrets.",
    createdAt: "2026-03-06",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      },
    ],
  },
  {
    _id: "4",
    title: "Recipe: Daal I'll never forget",
    content:
      "Tried to recreate my grandmother's daal today. Got close but not quite there. The secret might be in the tempering — more ghee, slower heat.",
    createdAt: "2026-03-04",
    media: [],
  },
  {
    _id: "5",
    title: "Evening walk by the river",
    content:
      "The river was unusually calm today. Walked for almost an hour without checking my phone once. A small victory.",
    createdAt: "2026-03-02",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400",
      },
    ],
  },
  {
    _id: "6",
    title: "New project started",
    content:
      "Finally started the side project I've been putting off for months. Just a few lines of code but it felt good to begin.",
    createdAt: "2026-02-28",
    media: [],
  },
];

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
      {/* Thumbnail */}
      {entry.media &&
        entry.media.length > 0 &&
        entry.media[0].type === "image" && (
          <img
            src={entry.media[0].url}
            alt={entry.title}
            className="w-full object-cover"
            style={{ maxHeight: "200px" }}
          />
        )}

      <div className="p-5">
        {/* Date */}
        <p
          className="text-xs tracking-widest uppercase mb-2"
          style={{ color: "#b0997c" }}
        >
          {formatDate(entry.createdAt)}
        </p>

        {/* Title */}
        <h3
          className="text-base font-semibold mb-2 leading-snug"
          style={{ color: "#5c4a32", fontFamily: "Georgia, serif" }}
        >
          {entry.title}
        </h3>

        {/* Content preview */}
        {entry.content && (
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
            {entry.content}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = dummyEntries.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()),
  );

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
              {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
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

        {/* Search bar */}
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

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p
              className="text-lg mb-2"
              style={{ color: "#a08c72", fontFamily: "Georgia, serif" }}
            >
              No entries found
            </p>
            <p className="text-sm" style={{ color: "#b0997c" }}>
              Try a different search or create a new entry
            </p>
          </div>
        )}

        {/* Masonry grid */}
        <div className="masonry" style={{ columnCount: 3, columnGap: "16px" }}>
          {filtered.map((entry) => (
            <EntryCard
              key={entry._id}
              entry={entry}
              onClick={() => navigate(`/entry/${entry._id}`)}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
