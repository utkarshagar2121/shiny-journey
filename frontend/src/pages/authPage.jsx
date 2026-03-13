import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

export default function AuthPage() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [isFlipped, setIsFlipped] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log(loginEmail)
      console.log(loginPassword)
      await login(loginEmail, loginPassword);
      // navigate happens inside login()
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(signupName, signupEmail, signupPassword);
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#faf7f2" }}
    >
      {/* TOP — Logo + Flipping Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1
            className="text-3xl font-semibold"
            style={{ color: "#5c4a32", fontFamily: "Georgia, serif" }}
          >
            📖 Memoria
          </h1>
          <p
            className="text-xs tracking-widest uppercase mt-1"
            style={{ color: "#a08c72" }}
          >
            Your personal journal
          </p>
        </div>

        {/* Flip Card Container */}
        <div className="w-full max-w-md" style={{ perspective: "1200px" }}>
          <div
            className="relative w-full"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              minHeight: "380px",
            }}
          >
            {/* FRONT — Login */}
            <div
              className="absolute inset-0 w-full p-8 shadow-sm"
              style={{
                backgroundColor: "#fffdf9",
                borderRadius: "20px",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <h2
                className="text-xl font-medium mb-1"
                style={{ color: "#5c4a32", fontFamily: "Georgia, serif" }}
              >
                Welcome back
              </h2>
              <p className="text-sm mb-6" style={{ color: "#a08c72" }}>
                Sign in to continue your journey
              </p>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "#7a6652" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 text-sm outline-none rounded-xl"
                    style={{
                      backgroundColor: "#f5f0e8",
                      color: "#5c4a32",
                      border: "none",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "#7a6652" }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 text-sm outline-none rounded-xl"
                    style={{
                      backgroundColor: "#f5f0e8",
                      color: "#5c4a32",
                      border: "none",
                    }}
                  />
                </div>
                {/* add inside both form — just above the submit button */}
                {error && (
                  <p
                    className="text-xs text-center"
                    style={{ color: "#b04040" }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide mt-1 hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: "#c4a882",
                    color: "#fffdf9",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "Please wait..." : "Sign in"}
                </button>
              </form>

              <p
                className="text-center text-sm mt-5"
                style={{ color: "#a08c72" }}
              >
                No account yet?{" "}
                <button
                  onClick={() => {
                    setIsFlipped(true);
                    setError("");
                  }}
                  className="font-medium hover:underline"
                  style={{
                    color: "#8a6f50",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Create one
                </button>
              </p>
            </div>

            {/* BACK — Signup */}
            <div
              className="absolute inset-0 w-full p-8 shadow-sm"
              style={{
                backgroundColor: "#fffdf9",
                borderRadius: "20px",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <h2
                className="text-xl font-medium mb-1"
                style={{ color: "#5c4a32", fontFamily: "Georgia, serif" }}
              >
                Start your journal
              </h2>
              <p className="text-sm mb-6" style={{ color: "#a08c72" }}>
                Create your account — free forever
              </p>

              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "#7a6652" }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    className="w-full px-4 py-3 text-sm outline-none rounded-xl"
                    style={{
                      backgroundColor: "#f5f0e8",
                      color: "#5c4a32",
                      border: "none",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "#7a6652" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 text-sm outline-none rounded-xl"
                    style={{
                      backgroundColor: "#f5f0e8",
                      color: "#5c4a32",
                      border: "none",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "#7a6652" }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 text-sm outline-none rounded-xl"
                    style={{
                      backgroundColor: "#f5f0e8",
                      color: "#5c4a32",
                      border: "none",
                    }}
                  />
                </div>
                {/* add inside both form — just above the submit button */}
                {error && (
                  <p
                    className="text-xs text-center"
                    style={{ color: "#b04040" }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide mt-1 hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: "#c4a882",
                    color: "#fffdf9",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "Please wait..." : "Sign Up"}
                </button>
              </form>

              <p
                className="text-center text-sm mt-5"
                style={{ color: "#a08c72" }}
              >
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setError("");
                  }}
                  className="font-medium hover:underline"
                  style={{
                    color: "#8a6f50",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM — Rotating Quotes */}
      <div
        className="flex flex-col items-center py-10 px-6"
        style={{ borderTop: "1px solid #ede8df" }}
      >
        <div
          className="text-center max-w-md"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <p
            className="text-sm italic leading-relaxed"
            style={{ color: "#7a6652", fontFamily: "Georgia, serif" }}
          >
            "{quotes[quoteIndex].text}"
          </p>
          <p
            className="text-xs tracking-widest uppercase mt-2"
            style={{ color: "#b0997c" }}
          >
            — {quotes[quoteIndex].author}
          </p>
        </div>

        <div className="flex gap-2 mt-5">
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
      </div>
    </div>
  );
}
