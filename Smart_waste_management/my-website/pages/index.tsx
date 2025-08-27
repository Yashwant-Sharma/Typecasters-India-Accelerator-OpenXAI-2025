import { useEffect, useRef, useState } from "react";
import { loadModel, detectObjects } from "../utils/tfModel";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detections, setDetections] = useState<any[]>([]);

  const OBJECT_INFO: Record<string, { material: string; recyclable: string }> = {
    bottle: { material: "Plastic", recyclable: "Recyclable" },
    book: { material: "Paper", recyclable: "Recyclable" },
    cup: { material: "Plastic", recyclable: "Recyclable" },
    handbag: { material: "Plastic/Fabric", recyclable: "Recyclable" },
    laptop: { material: "Metal/Plastic", recyclable: "Recyclable" },
  };

  const TARGET_OBJECTS = Object.keys(OBJECT_INFO);

  // Start live camera
  const startCamera = async () => {
    if (navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    }
  };

  // Run camera detection
  useEffect(() => {
    let interval: NodeJS.Timer;

    const runDetection = async () => {
      await loadModel();
      if (!videoRef.current || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      interval = setInterval(async () => {
        const predictions = await detectObjects(videoRef.current!);
        drawPredictions(predictions, ctx);
      }, 500);
    };

    startCamera();
    runDetection();

    return () => clearInterval(interval);
  }, []);

  // Draw boxes and labels
  const drawPredictions = (predictions: any[], ctx: CanvasRenderingContext2D) => {
    const filtered = predictions.filter(p =>
      TARGET_OBJECTS.includes(p.class.toLowerCase())
    );
    setDetections(filtered);

    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

    filtered.forEach(pred => {
      const [x, y, width, height] = pred.bbox;
      const info = OBJECT_INFO[pred.class.toLowerCase()];

      // Draw box
      ctx.strokeStyle = "#4CAF50"; // green
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // Draw text
      ctx.fillStyle = "#4CAF50";
      ctx.font = "16px Arial";
      ctx.fillText(pred.class, x, y > 20 ? y - 30 : y + 15);
      ctx.fillText(`Material: ${info.material}`, x, y > 20 ? y - 15 : y + 30);
      ctx.fillText(`Status: ${info.recyclable}`, x, y > 20 ? y : y + 45);
    });
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#0b0b0bff",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#2E7D32", fontSize: "2.5rem", marginBottom: "20px" }}>
        ♻️ Smart Waste Detection
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#555" }}>
        Detect recyclable objects in real-time from your camera
      </p>

      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginTop: "30px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width="640"
          height="480"
          style={{ display: "block" }}
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>

      <div
        style={{
          marginTop: "30px",
          backgroundColor: "#da1919ff",
          display: "inline-block",
          padding: "20px 30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          minWidth: "300px",
        }}
      >
        <h2 style={{ color: "#000000ff" }}><b>Detections</b></h2>
        <p>
          Total objects detected: <strong>{detections.length}</strong>
        </p>
        <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
          {Object.entries(
            detections.reduce((acc, item) => {
              acc[item.class] = (acc[item.class] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([cls, count]) => (
            <li key={cls}>
              {cls}: {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
