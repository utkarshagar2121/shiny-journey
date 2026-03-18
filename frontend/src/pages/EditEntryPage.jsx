import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useApi } from "../api/useApi";
import { useAuth } from "../context/AuthContext";
// ─── Camera Modal (same as CreateEntryPage) ───────────────
function CameraModal({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const [mode, setMode] = useState("photo");
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const timerRef = useRef(null);

  const startStream = useCallback(async (facing) => {
    if (streamRef.current)
      streamRef.current.getTracks().forEach((t) => t.stop());
    setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch (err) {
      if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError")
        setCameraError("No camera found on this device.");
      else if (err.name === "NotAllowedError")
        setCameraError(
          "Camera permission denied. Please allow access in your browser settings and refresh.",
        );
      else setCameraError("Could not access camera: " + err.message);
    }
  }, []);

  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then((devices) => {
      setHasMultipleCameras(
        devices.filter((d) => d.kind === "videoinput").length > 1,
      );
    });
    startStream("user");
    return () => {
      if (streamRef.current)
        streamRef.current.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const flipCamera = () => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    startStream(next);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        const file = new File([blob], `photo_${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCapture({ file, preview: URL.createObjectURL(file), type: "image" });
      },
      "image/jpeg",
      0.9,
    );
  };

  const startRecording = () => {
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const file = new File([blob], `video_${Date.now()}.webm`, {
        type: "video/webm",
      });
      onCapture({ file, preview: URL.createObjectURL(file), type: "video" });
    };
    recorder.start();
    setRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    clearInterval(timerRef.current);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const type = file.type.startsWith("video/") ? "video" : "image";
    onCapture({ file, preview: URL.createObjectURL(file), type });
    e.target.value = "";
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.9)", zIndex: 70 }}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ backgroundColor: "#1a1410" }}
      >
        {cameraError ? (
          <div className="flex flex-col items-center justify-center p-10 gap-5">
            <p className="text-2xl">📷</p>
            <p
              className="text-center text-sm leading-relaxed"
              style={{ color: "#c4a882" }}
            >
              {cameraError}
            </p>
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full py-3 rounded-2xl text-sm font-medium"
              style={{
                backgroundColor: "#f5f0e8",
                color: "#5c4a32",
                border: "none",
                cursor: "pointer",
              }}
            >
              📁 Upload from Device
            </button>
            <button
              onClick={onClose}
              className="text-xs hover:underline"
              style={{
                color: "#7a6652",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <div
              className="relative"
              style={{ backgroundColor: "#000", minHeight: "300px" }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full"
                style={{
                  maxHeight: "400px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {!cameraReady && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: "#1a1410" }}
                >
                  <p className="text-sm" style={{ color: "#7a6652" }}>
                    Starting camera...
                  </p>
                </div>
              )}
              {recording && (
                <div
                  className="absolute top-4 left-1/2 flex items-center gap-2 px-3 py-1 rounded-full"
                  style={{
                    transform: "translateX(-50%)",
                    backgroundColor: "rgba(0,0,0,0.65)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#e05555",
                    }}
                  />
                  <span
                    className="text-xs font-mono"
                    style={{ color: "#fffdf9" }}
                  >
                    {formatTime(recordingTime)}
                  </span>
                </div>
              )}
              <div
                className="absolute top-4 right-4 flex rounded-full overflow-hidden"
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <button
                  onClick={() => {
                    if (!recording) setMode("photo");
                  }}
                  className="px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor:
                      mode === "photo" ? "#c4a882" : "transparent",
                    color: "#fffdf9",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Photo
                </button>
                <button
                  onClick={() => {
                    if (!recording) setMode("video");
                  }}
                  className="px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor:
                      mode === "video" ? "#c4a882" : "transparent",
                    color: "#fffdf9",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Video
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-5">
              <button
                onClick={onClose}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "#fffdf9",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ✕
              </button>
              {mode === "photo" ? (
                <button
                  onClick={capturePhoto}
                  disabled={!cameraReady}
                  style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "50%",
                    backgroundColor: cameraReady ? "#fffdf9" : "#555",
                    border: "4px solid rgba(255,255,255,0.25)",
                    cursor: cameraReady ? "pointer" : "not-allowed",
                  }}
                />
              ) : (
                <button
                  onClick={recording ? stopRecording : startRecording}
                  disabled={!cameraReady}
                  style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "50%",
                    backgroundColor: recording
                      ? "#e05555"
                      : cameraReady
                        ? "#fffdf9"
                        : "#555",
                    border: "4px solid rgba(255,255,255,0.25)",
                    cursor: cameraReady ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {recording && (
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#fffdf9",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                </button>
              )}
              {hasMultipleCameras ? (
                <button
                  onClick={flipCamera}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  🔄
                </button>
              ) : (
                <button
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  📁
                </button>
              )}
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full py-2 rounded-2xl text-xs font-medium hover:opacity-80"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  color: "#a08c72",
                  border: "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                }}
              >
                📁 Upload from device instead
              </button>
            </div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    </div>
  );
}

// ─── Text Block ───────────────────────────────────────────
function TextBlock({ block, onChange, onDelete }) {
  const textareaRef = useRef(null);
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [block.value]);

  return (
    <div className="relative group">
      <textarea
        ref={textareaRef}
        value={block.value}
        onChange={(e) => onChange(block.id, e.target.value)}
        placeholder="Write something..."
        rows={2}
        className="w-full text-base leading-relaxed outline-none resize-none rounded-xl px-4 py-3"
        style={{
          backgroundColor: "#fffdf9",
          color: "#5c4a32",
          fontFamily: "Georgia, serif",
          border: "1px solid #ede8df",
          overflow: "hidden",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#c4a882")}
        onBlur={(e) => (e.target.style.borderColor = "#ede8df")}
      />
      <button
        onClick={() => onDelete(block.id)}
        className="absolute top-2 right-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity rounded-full px-2 py-1"
        style={{
          backgroundColor: "#fdecea",
          color: "#b04040",
          border: "none",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
}

// ─── Image Block ──────────────────────────────────────────
function ImageBlock({ block, onDelete }) {
  const [enlarged, setEnlarged] = useState(false);
  const [hovered, setHovered] = useState(false);
  // existing blocks have `url`, new captures have `preview`
  const src = block.preview || block.url;

  return (
    <div className="relative group">
      <div
        className="relative cursor-pointer inline-block"
        onClick={() => setEnlarged((p) => !p)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: enlarged ? "100%" : "120px",
          transition: "width 0.4s ease",
        }}
      >
        <img
          src={src}
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
      <button
        onClick={() => onDelete(block.id)}
        className="absolute top-0 right-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity rounded-full px-2 py-1"
        style={{
          backgroundColor: "#fdecea",
          color: "#b04040",
          border: "none",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
}

// ─── Video Block ──────────────────────────────────────────
function VideoBlock({ block, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const src = block.preview || block.url;

  return (
    <div
      className="relative group"
      style={{ width: expanded ? "100%" : "fit-content" }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer"
        onClick={() => setExpanded((p) => !p)}
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
            {block.file?.name || "Video clip"}
          </p>
          <p className="text-xs" style={{ color: "#a08c72" }}>
            {expanded ? "Click to close" : "Click to preview"}
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
          {expanded ? "Click to collapse" : "Click to preview video"}
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
          src={src}
          controls
          className="w-full rounded-2xl"
          style={{ maxHeight: "400px", display: "block" }}
        />
      </div>
      <button
        onClick={() => onDelete(block.id)}
        className="absolute top-0 right-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity rounded-full px-2 py-1"
        style={{
          backgroundColor: "#fdecea",
          color: "#b04040",
          border: "none",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
}

// ─── Add Block Buttons ────────────────────────────────────
function AddBlockButtons({ onAddText, onAddMedia }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="flex items-center gap-2 py-1"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div className="flex-1 h-px" style={{ backgroundColor: "#ede8df" }} />
      <div
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
          display: "flex",
          gap: "6px",
        }}
      >
        <button
          onClick={onAddText}
          className="text-xs px-3 py-1 rounded-full hover:opacity-80"
          style={{
            backgroundColor: "#f5f0e8",
            color: "#7a6652",
            border: "none",
            cursor: "pointer",
          }}
        >
          + Text
        </button>
        <button
          onClick={onAddMedia}
          className="text-xs px-3 py-1 rounded-full hover:opacity-80"
          style={{
            backgroundColor: "#f5f0e8",
            color: "#7a6652",
            border: "none",
            cursor: "pointer",
          }}
        >
          + Media
        </button>
      </div>
      <div className="flex-1 h-px" style={{ backgroundColor: "#ede8df" }} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function EditEntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [pendingInsertIndex, setPendingInsertIndex] = useState(null);

  // fetch existing entry
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await api.get(`/journal/${id}`);
        const entry = res.data.entry;
        setTitle(entry.title);
        // map existing blocks to local format — existing media has url, no file
        setBlocks(
          entry.blocks.map((b) => ({
            id: b._id,
            type: b.type,
            value: b.value || "",
            url: b.url || null, // existing cloudinary url
            publicId: b.publicId || null,
            preview: null, // no local preview for existing media
            file: null, // no file for existing media
          })),
        );
      } catch (err) {
        console.log("load error ", err.message);

        alert("Failed to load entry.");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  const openCamera = (afterIndex = blocks.length - 1) => {
    setPendingInsertIndex(afterIndex);
    setShowCamera(true);
  };

  const addTextBlock = (afterIndex = blocks.length - 1) => {
    const newBlock = { id: Date.now(), type: "text", value: "" };
    const updated = [...blocks];
    updated.splice(afterIndex + 1, 0, newBlock);
    setBlocks(updated);
  };

  const insertMediaBlock = ({ file, preview, type }) => {
    const newBlock = { id: Date.now(), type, file, preview, url: null };
    const updated = [...blocks];
    updated.splice((pendingInsertIndex ?? blocks.length - 1) + 1, 0, newBlock);
    setBlocks(updated);
    setShowCamera(false);
  };

  const updateText = (id, value) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, value } : b)));
  };

  const deleteBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };
  const { tokenRef } = useAuth();
  // console.log(tokenRef);
  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please add a title before saving.");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title);

      const files = [];
      const blocksForApi = blocks.map((block) => {
        if (block.type === "text") {
          return { type: "text", value: block.value };
        } else if (block.file) {
          // new media block — has a file to upload
          const fileIndex = files.length;
          files.push(block.file);
          return { type: block.type, fileIndex };
        } else {
          // existing media block — keep url and publicId
          return { type: block.type, url: block.url, publicId: block.publicId };
        }
      });

      formData.append("blocks", JSON.stringify(blocksForApi));
      files.forEach((file) => formData.append("files", file));
      // console.log("token being sent ", tokenRef.current);
      await api.put(`/journal/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${tokenRef.current}`, // ← pass directly
        },
      });

      navigate(`/entry/${id}`);
    } catch (err) {
      console.log("save error", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
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

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: "100vh", backgroundColor: "#faf7f2" }}
    >
      <Header />

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(`/entry/${id}`)}
          className="text-sm mb-8 hover:underline"
          style={{
            color: "#a08c72",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          ← Back to entry
        </button>

        <input
          type="text"
          placeholder="Entry title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-3xl font-semibold outline-none mb-8 bg-transparent"
          style={{
            color: "#5c4a32",
            fontFamily: "Georgia, serif",
            border: "none",
            borderBottom: "2px solid #ede8df",
            paddingBottom: "12px",
          }}
          onFocus={(e) => (e.target.style.borderBottomColor = "#c4a882")}
          onBlur={(e) => (e.target.style.borderBottomColor = "#ede8df")}
        />

        <div className="flex flex-col gap-1">
          {blocks.map((block, index) => (
            <div key={block.id}>
              {block.type === "text" && (
                <TextBlock
                  block={block}
                  onChange={updateText}
                  onDelete={deleteBlock}
                />
              )}
              {block.type === "image" && (
                <ImageBlock block={block} onDelete={deleteBlock} />
              )}
              {block.type === "video" && (
                <VideoBlock block={block} onDelete={deleteBlock} />
              )}
              <AddBlockButtons
                onAddText={() => addTextBlock(index)}
                onAddMedia={() => openCamera(index)}
              />
            </div>
          ))}
        </div>

        <div style={{ height: "80px" }} />
      </main>

      {/* Fixed bottom toolbar */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-8 py-4"
        style={{
          backgroundColor: "#fffdf9",
          borderTop: "1px solid #ede8df",
          zIndex: 40,
        }}
      >
        <div className="flex gap-3">
          <button
            onClick={() => addTextBlock()}
            className="px-4 py-2 rounded-full text-sm hover:opacity-80"
            style={{
              backgroundColor: "#f5f0e8",
              color: "#7a6652",
              border: "none",
              cursor: "pointer",
            }}
          >
            + Text
          </button>
          <button
            onClick={() => openCamera()}
            className="px-4 py-2 rounded-full text-sm hover:opacity-80"
            style={{
              backgroundColor: "#f5f0e8",
              color: "#7a6652",
              border: "none",
              cursor: "pointer",
            }}
          >
            📷 Media
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 rounded-full text-sm font-semibold hover:opacity-90"
          style={{
            backgroundColor: "#c4a882",
            color: "#fffdf9",
            border: "none",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {showCamera && (
        <CameraModal
          onCapture={insertMediaBlock}
          onClose={() => setShowCamera(false)}
        />
      )}

      <Footer />
    </div>
  );
}
