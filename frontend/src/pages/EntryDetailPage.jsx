import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useApi } from "../api/useApi";

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function ImageBlock({ block }) {
  const [enlarged, setEnlarged] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => setEnlarged((prev) => !prev)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: enlarged ? "100%" : "120px",
        transition: "width 0.4s ease",
      }}
    >
      <img
        src={block.url}
        alt="journal entry"
        className="rounded-xl object-cover w-full"
        style={{
          height: enlarged ? "400px" : "90px",
          transition: "height 0.4s ease",
          objectFit: "cover",
        }}
      />
      <div
        className="absolute bottom-2 left-1/2 text-xs px-2 py-1 rounded-full"
        style={{
          transform: "translateX(-50%)",
          backgroundColor: "rgba(92,74,50,0.75)",
          color: "#fffdf9",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s ease",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          backdropFilter: "blur(4px)",
          fontSize: "10px",
        }}
      >
        {enlarged ? "↑ click to close" : "↓ click to enlarge"}
      </div>
    </div>
  );
}

function VideoBlock({ block }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        width: expanded ? "100%" : "fit-content",
        transition: "width 0.4s ease",
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer"
        onClick={() => setExpanded((prev) => !prev)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: "#f5f0e8",
          border: "1px solid #ede8df",
          width: "fit-content",
          position: "relative",
        }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: "#c4a882",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              color: "#fffdf9",
              fontSize: "14px",
              marginLeft: expanded ? "0" : "2px",
            }}
          >
            {expanded ? "✕" : "▶"}
          </span>
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: "#5c4a32" }}>
            Video clip
          </p>
          <p className="text-xs" style={{ color: "#a08c72" }}>
            {expanded ? "Click to close" : "Click to play"}
          </p>
        </div>
        <div
          className="absolute -top-7 left-0 text-xs px-2 py-1 rounded-full"
          style={{
            backgroundColor: "rgba(92,74,50,0.75)",
            color: "#fffdf9",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.2s ease",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            backdropFilter: "blur(4px)",
            fontSize: "10px",
          }}
        >
          {expanded ? "Click to collapse" : "Click to expand video"}
        </div>
      </div>
      <div
        style={{
          maxHeight: expanded ? "420px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.45s ease",
          marginTop: expanded ? "10px" : "0px",
        }}
      >
        <video
          src={block.url}
          controls
          className="w-full rounded-2xl"
          style={{ maxHeight: "400px", display: "block" }}
        />
      </div>
    </div>
  );
}

export default function EntryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await api.get(`/journal/${id}`);
        setEntry(res.data.entry);
      } catch (err) {
        console.log(err.message);

        setError("Entry not found or you don't have access.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.delete(`/journal/delete/${id}`);
      navigate("/dashboard");
    } catch (err) {
      console.log(err.message);
      alert("Failed to delete entry.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex flex-col"
        style={{ minHeight: "100vh", backgroundColor: "#faf7f2" }}
      >
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p style={{ color: "#a08c72", fontFamily: "Georgia, serif" }}>
            Loading...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div
        className="flex flex-col"
        style={{ minHeight: "100vh", backgroundColor: "#faf7f2" }}
      >
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p style={{ color: "#a08c72", fontFamily: "Georgia, serif" }}>
            {error || "Entry not found."}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: "100vh", backgroundColor: "#faf7f2" }}
    >
      <Header />

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm mb-8 hover:underline flex items-center gap-1"
          style={{
            color: "#a08c72",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          ← Back to journal
        </button>

        <p
          className="text-xs tracking-widest uppercase mb-3"
          style={{ color: "#b0997c" }}
        >
          {formatDate(entry.createdAt)}
        </p>

        <h1
          className="text-3xl font-semibold mb-8 leading-snug"
          style={{ color: "#5c4a32", fontFamily: "Georgia, serif" }}
        >
          {entry.title}
        </h1>

        <div className="flex flex-col gap-5">
          {entry.blocks.map((block) => {
            if (block.type === "text") {
              return (
                <p
                  key={block._id}
                  className="text-base leading-relaxed"
                  style={{ color: "#5c4a32", fontFamily: "Georgia, serif" }}
                >
                  {block.value}
                </p>
              );
            }
            if (block.type === "image")
              return <ImageBlock key={block._id} block={block} />;
            if (block.type === "video")
              return <VideoBlock key={block._id} block={block} />;
            return null;
          })}
        </div>

        <div
          className="flex gap-3 mt-10 pt-6"
          style={{ borderTop: "1px solid #ede8df" }}
        >
          <button
            onClick={() => navigate(`/entry/${entry._id}/edit`)}
            className="px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "#f5f0e8",
              color: "#7a6652",
              border: "none",
              cursor: "pointer",
            }}
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "#fdecea",
              color: "#b04040",
              border: "none",
              cursor: "pointer",
              opacity: deleting ? 0.6 : 1,
            }}
          >
            {deleting ? "Deleting..." : "🗑️ Delete"}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
