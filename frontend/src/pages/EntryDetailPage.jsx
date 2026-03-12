import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

const dummyEntries = [
  {
    _id: "1",
    title: "A quiet morning in the hills",
    createdAt: "2026-03-10",
    blocks: [
      {
        _id: "b1",
        type: "text",
        value:
          "Woke up early today. The mist was still settling over the valley when I stepped outside with my coffee.",
      },
      {
        _id: "b2",
        type: "image",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      },
      {
        _id: "b3",
        type: "text",
        value:
          "I recorded a small clip of the birds outside. Something about hearing it again brings me right back.",
      },
      {
        _id: "b4",
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        _id: "b5",
        type: "text",
        value:
          "I sat on the porch for almost an hour, just watching the light change. No phone, no music.",
      },
    ],
  },
  {
    _id: "2",
    title: "Thoughts on slowing down",
    createdAt: "2026-03-08",
    blocks: [
      {
        _id: "b4",
        type: "text",
        value:
          "Been thinking a lot about pace lately. Not just physical pace, but the pace of thought, of conversation, of decision making.",
      },
      {
        _id: "b5",
        type: "text",
        value:
          "We're trained to respond instantly, decide quickly, move fast. But I wonder what we lose in that speed. Some of my best ideas have come in the shower, or on a walk, or right before sleep.",
      },
    ],
  },
  {
    _id: "3",
    title: "The bookshop on 5th",
    createdAt: "2026-03-06",
    blocks: [
      {
        _id: "b6",
        type: "text",
        value:
          "Found a tiny bookshop tucked between a laundry and a bakery. Spent two hours in there.",
      },
      {
        _id: "b7",
        type: "image",
        url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
      },
      {
        _id: "b8",
        type: "text",
        value:
          "Left with four books I didn't plan to buy and zero regrets. The owner was an old man who barely looked up from his own book when I walked in. There was a cat asleep on a stack of poetry collections.",
      },
    ],
  },
  {
    _id: "4",
    title: "Recipe: Daal I'll never forget",
    createdAt: "2026-03-04",
    blocks: [
      {
        _id: "b9",
        type: "text",
        value:
          "Tried to recreate my grandmother's daal today. Got close but not quite there. The secret might be in the tempering — more ghee, slower heat.",
      },
      {
        _id: "b10",
        type: "text",
        value:
          "She never used a recipe. Just memory and instinct. I called my mom halfway through to ask about the spices. She laughed and said grandma never measured anything.",
      },
    ],
  },
  {
    _id: "5",
    title: "Evening walk by the river",
    createdAt: "2026-03-02",
    blocks: [
      {
        _id: "b11",
        type: "text",
        value:
          "The river was unusually calm today. Walked for almost an hour without checking my phone once. A small victory.",
      },
      {
        _id: "b12",
        type: "image",
        url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
      },
      {
        _id: "b13",
        type: "text",
        value:
          "Watched a family of ducks navigate the current near the bank. Two kids were skipping stones nearby. I tried too — managed three skips on my best throw.",
      },
    ],
  },
  {
    _id: "6",
    title: "New project started",
    createdAt: "2026-02-28",
    blocks: [
      {
        _id: "b14",
        type: "text",
        value:
          "Finally started the side project I've been putting off for months. Just a few lines of code but it felt good to begin.",
      },
      {
        _id: "b15",
        type: "text",
        value:
          "There's always this strange friction before starting something new — a mix of excitement and dread. Once you're in it though, the resistance fades.",
      },
    ],
  },
];

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

      {/* Hover tooltip */}
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
      {/* Compact pill — always visible */}
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
          transition: "opacity 0.2s ease",
        }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: "36px",
            height: "36px",
            backgroundColor: "#c4a882",
            flexShrink: 0,
            transition: "background-color 0.2s ease",
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

        {/* Hover tooltip */}
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

      {/* Video player — slides in below the pill */}
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
  const entry = dummyEntries.find((e) => e._id === id);

  if (!entry) {
    return (
      <div
        className="flex flex-col"
        style={{ minHeight: "100vh", backgroundColor: "#faf7f2" }}
      >
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p style={{ color: "#a08c72", fontFamily: "Georgia, serif" }}>
            Entry not found.
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
        {/* Back button */}
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

        {/* Date */}
        <p
          className="text-xs tracking-widest uppercase mb-3"
          style={{ color: "#b0997c" }}
        >
          {formatDate(entry.createdAt)}
        </p>

        {/* Title */}
        <h1
          className="text-3xl font-semibold mb-8 leading-snug"
          style={{ color: "#5c4a32", fontFamily: "Georgia, serif" }}
        >
          {entry.title}
        </h1>

        {/* Blocks — rendered inline in order */}
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
            if (block.type === "image") {
              return <ImageBlock key={block._id} block={block} />;
            }
            if (block.type === "video") {
              return <VideoBlock key={block._id} block={block} />;
            }
            return null;
          })}
        </div>

        {/* Actions */}
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
            className="px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: "#fdecea",
              color: "#b04040",
              border: "none",
              cursor: "pointer",
            }}
          >
            🗑️ Delete
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
