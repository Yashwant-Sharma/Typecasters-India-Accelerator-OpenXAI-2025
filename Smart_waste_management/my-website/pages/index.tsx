// pages/index.tsx
import { useEffect, useRef, useState } from "react";
import { loadModel, detectObjects } from "../utils/tfModel";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detections, setDetections] = useState<any[]>([]);

  // Define objects with material and recyclable info
  const OBJECT_INFO: Record<string, { material: string; recyclable: string }> = {
    bottle: { material: "Plastic", recyclable: "Recyclable" },
    book: { material: "Paper", recyclable: "Recyclable" },
    cup: { material: "Plastic", recyclable: "Recyclable" },
    handbag: { material: "Plastic/Fabric", recyclable: "Recyclable" },
    laptop: { material: "Metal/Plastic", recyclable: "Recyclable" },
  };

  const TARGET_OBJECTS = Object.keys(OBJECT_INFO);

  // Setup camera
  useEffect(() => {
    async function setupCamera() {
      if (navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      }
    }
    setupCamera();
  }, []);

  // Run detection + draw bounding boxes
  useEffect(() => {
    let interval: NodeJS.Timer;

    async function runDetection() {
      await loadModel();

      interval = setInterval(async () => {
        if (videoRef.current && canvasRef.current) {
          const predictions = await detectObjects(videoRef.current);

          // Filter only target objects
          const filtered = predictions.filter(p =>
            TARGET_OBJECTS.includes(p.class.toLowerCase())
          );
          setDetections(filtered);

          const ctx = canvasRef.current.getContext("2d");
          if (!ctx) return;

          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          filtered.forEach(pred => {
            const [x, y, width, height] = pred.bbox;

            // Draw green box
            ctx.strokeStyle = "green";
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            // Draw labels: object name, material, recyclable
            const info = OBJECT_INFO[pred.class.toLowerCase()];
            ctx.fillStyle = "green";
            ctx.font = "16px Arial";
            ctx.fillText(pred.class, x, y > 20 ? y - 30 : y + 15);
            ctx.fillText(`Material: ${info.material}`, x, y > 20 ? y - 15 : y + 30);
            ctx.fillText(`Status: ${info.recyclable}`, x, y > 20 ? y : y + 45);
          });
        }
      }, 500);
    }

    runDetection();
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>♻️ Smart Waste Detection</h1>
      <div style={{ position: "relative", display: "inline-block" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          width="600"
          height="400"
          style={{ borderRadius: "10px" }}
        />
        <canvas
          ref={canvasRef}
          width="600"
          height="400"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>

      <h2>Detections:</h2>
      <ul>
        {detections.map((item, i) => (
          <li key={i}>
            {item.class} ({Math.round(item.score * 100)}%)
          </li>
        ))}
      </ul>
    </div>
  );
}
