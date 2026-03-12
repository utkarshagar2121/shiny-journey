import React, { useRef } from "react";

const CameraTest = () => {
  const videoRef = useRef(null);

  const startCamera = async () => {
    const constraints = { video: true };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access failed: " + err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Camera Access Test</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "500px",
          maxWidth: "90%",
          border: "2px solid #333",
          borderRadius: "8px",
        }}
      />

      <br />

      <button
        onClick={startCamera}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Start Camera
      </button>
    </div>
  );
};

export default CameraTest;
