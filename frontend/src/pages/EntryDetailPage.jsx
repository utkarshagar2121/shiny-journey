import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// same dummy data — later this will come from the API
const dummyEntries = [
  {
    _id: "1",
    title: "A quiet morning in the hills",
    content:
      "Woke up early today. The mist was still settling over the valley when I stepped outside with my coffee. There's something about mornings like these that make everything feel possible. I sat on the porch for almost an hour, just watching the light change. No phone, no music. Just the sound of birds and wind through the trees. I've been trying to do this more often — find pockets of stillness in the day. It's harder than it sounds.",
    createdAt: "2026-03-10",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      },
    ],
  },
  {
    _id: "2",
    title: "Thoughts on slowing down",
    content:
      "Been thinking a lot about pace lately. Not just physical pace, but the pace of thought, of conversation, of decision making. We're trained to respond instantly, decide quickly, move fast. But I wonder what we lose in that speed. Some of my best ideas have come in the shower, or on a walk, or right before sleep — moments when the mind is allowed to wander without agenda.",
    createdAt: "2026-03-08",
    media: [],
  },
  {
    _id: "3",
    title: "The bookshop on 5th",
    content:
      "Found a tiny bookshop tucked between a laundry and a bakery. Spent two hours in there. Left with four books I didn't plan to buy and zero regrets. The owner was an old man who barely looked up from his own book when I walked in. There was a cat asleep on a stack of poetry collections. The whole place smelled like old paper and something faintly sweet. I want to go back every week.",
    createdAt: "2026-03-06",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
      },
    ],
  },
  {
    _id: "4",
    title: "Recipe: Daal I'll never forget",
    content:
      "Tried to recreate my grandmother's daal today. Got close but not quite there. The secret might be in the tempering — more ghee, slower heat. She never used a recipe. Just memory and instinct. I called my mom halfway through to ask about the spices. She laughed and said grandma never measured anything. Maybe that's the ingredient I'm missing.",
    createdAt: "2026-03-04",
    media: [],
  },
  {
    _id: "5",
    title: "Evening walk by the river",
    content:
      "The river was unusually calm today. Walked for almost an hour without checking my phone once. A small victory. Watched a family of ducks navigate the current near the bank. Two kids were skipping stones nearby. I tried too — managed three skips on my best throw. Not bad for someone who hasn't done it since childhood.",
    createdAt: "2026-03-02",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800",
      },
    ],
  },
  {
    _id: "6",
    title: "New project started",
    content:
      "Finally started the side project I've been putting off for months. Just a few lines of code but it felt good to begin. There's always this strange friction before starting something new — a mix of excitement and dread. Once you're in it though, the resistance fades. I worked for three hours straight without noticing the time. That's always a good sign.",
    createdAt: "2026-02-28",
    media: [],
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
          className="text-3xl font-semibold mb-6 leading-snug"
          style={{ color: "#5c4a32", fontFamily: "Georgia, serif" }}
        >
          {entry.title}
        </h1>

        {/* Media */}
        {entry.media && entry.media.length > 0 && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            {entry.media.map((item, i) =>
              item.type === "image" ? (
                <img
                  key={i}
                  src={item.url}
                  alt={entry.title}
                  className="w-full object-cover rounded-2xl"
                  style={{ maxHeight: "400px" }}
                />
              ) : (
                <video
                  key={i}
                  src={item.url}
                  controls
                  className="w-full rounded-2xl"
                />
              ),
            )}
          </div>
        )}

        {/* Content */}
        <p
          className="text-base leading-relaxed"
          style={{ color: "#5c4a32", fontFamily: "Georgia, serif" }}
        >
          {entry.content}
        </p>

        {/* Actions */}
        <div
          className="flex gap-3 mt-10 pt-6"
          style={{ borderTop: "1px solid #ede8df" }}
        >
          <button
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
