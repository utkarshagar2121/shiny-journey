import { useState, useEffect } from "react";

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

export default function Footer() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [visible, setVisible] = useState(true);

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
    <footer
      className="w-full px-6 py-4 flex items-center justify-between"
      style={{ borderTop: "1px solid #ede8df", backgroundColor: "#fffdf9" }}
    >
      {/* Left — app name */}
      <p
        className="text-xs tracking-widest uppercase"
        style={{ color: "#c4b49a" }}
      >
        📖 Memoria
      </p>

      {/* Center — rotating quote */}
      <div
        className="text-center"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <p
          className="text-xs italic"
          style={{ color: "#b0997c", fontFamily: "Georgia, serif" }}
        >
          "{quotes[quoteIndex].text}" — {quotes[quoteIndex].author}
        </p>
      </div>

      {/* Right — made with warmth */}
      <p
        className="text-xs tracking-widest uppercase"
        style={{ color: "#c4b49a" }}
      >
        Made with warmth
      </p>
    </footer>
  );
}
