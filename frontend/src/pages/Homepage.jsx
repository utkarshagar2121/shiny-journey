import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const quotes = [
  { text: "Write what should not be forgotten.", author: "Isabel Allende" },
  { text: "A journal is a mirror you can speak to.", author: "Unknown" },
  {
    text: "Fill your paper with the breathings of your heart.",
    author: "William Wordsworth",
  },
  {
    text: "In the journal I do not just express myself, I create myself.",
    author: "Susan Sontag",
  },
  {
    text: "The act of writing is the act of discovering what you believe.",
    author: "David Hare",
  },
];

const features = [
  {
    icon: "🖊️",
    title: "Write Freely",
    desc: "Capture your thoughts, feelings, and memories in rich text entries. No rules, just you.",
  },
  {
    icon: "🎞️",
    title: "Attach Memories",
    desc: "Add photos and videos directly to your entries. Relive the moments, not just the words.",
  },
  {
    icon: "🔒",
    title: "Private & Secure",
    desc: "Your journal is yours alone. Every entry is protected behind secure authentication.",
  },
  {
    icon: "🔍",
    title: "Search & Revisit",
    desc: "Find any entry instantly with powerful search. Your past is always within reach.",
  },
];

export default function HomePage() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#faf7f2", fontFamily: "Georgia, serif" }}
    >
      {/* ── HERO ── */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
        <div className="mb-4 text-5xl">📖</div>
        <h1
          className="text-5xl font-bold mb-4 leading-tight"
          style={{ color: "#5c4a32" }}
        >
          Memoria
        </h1>
        <p
          className="text-base tracking-widest uppercase mb-4"
          style={{ color: "#a08c72" }}
        >
          Your personal video journal
        </p>
        <p
          className="text-lg max-w-xl leading-relaxed mb-10"
          style={{ color: "#7a6652" }}
        >
          A warm, private space to write your thoughts, attach your memories,
          and revisit the moments that shaped you.
        </p>
        <button
          onClick={() => navigate("/auth")}
          className="px-10 py-4 rounded-full text-base font-semibold tracking-wide transition-all duration-200 hover:opacity-90 hover:scale-105"
          style={{ backgroundColor: "#c4a882", color: "#fffdf9" }}
        >
          Start Your Journal →
        </button>
      </section>

      {/* ── DIVIDER ── */}
      <div
        className="w-24 h-px mx-auto"
        style={{ backgroundColor: "#ddd3c0" }}
      />

      {/* ── FEATURES ── */}
      <section className="px-6 py-16 max-w-4xl mx-auto w-full">
        <h2
          className="text-2xl font-semibold text-center mb-10"
          style={{ color: "#5c4a32" }}
        >
          Everything you need to journal deeply
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md"
              style={{ backgroundColor: "#fffdf9" }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ color: "#5c4a32" }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#7a6652", fontFamily: "sans-serif" }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div
        className="w-24 h-px mx-auto"
        style={{ backgroundColor: "#ddd3c0" }}
      />

      {/* ── TESTIMONIAL QUOTES ── */}
      <section className="flex flex-col items-center px-6 py-16">
        <h2
          className="text-2xl font-semibold text-center mb-10"
          style={{ color: "#5c4a32" }}
        >
          Words about journaling
        </h2>

        <div
          className="max-w-xl text-center px-8 py-10 rounded-2xl shadow-sm w-full"
          style={{ backgroundColor: "#fffdf9", minHeight: "160px" }}
        >
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            <p
              className="text-lg italic leading-relaxed mb-4"
              style={{ color: "#5c4a32" }}
            >
              "{quotes[quoteIndex].text}"
            </p>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: "#b0997c", fontFamily: "sans-serif" }}
            >
              — {quotes[quoteIndex].author}
            </p>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-6">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setVisible(false);
                setTimeout(() => {
                  setQuoteIndex(i);
                  setVisible(true);
                }, 300);
              }}
              style={{
                width: i === quoteIndex ? "20px" : "6px",
                height: "6px",
                borderRadius: "999px",
                backgroundColor: i === quoteIndex ? "#c4a882" : "#ddd3c0",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="text-center py-6 text-xs tracking-widest uppercase"
        style={{
          borderTop: "1px solid #ede8df",
          color: "#b0997c",
          fontFamily: "sans-serif",
        }}
      >
        📖 Memoria — Your personal journal · Made with warmth
      </footer>
    </div>
  );
}
