// utils/tfModel.ts
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs"; // loads TensorFlow.js backend

let model: cocoSsd.ObjectDetection | null = null;

// Load the model (only once)
export async function loadModel() {
  if (!model) {
    model = await cocoSsd.load();
    console.log("✅ TensorFlow model loaded");
  }
  return model;
}

// Run detection
export async function detectObjects(video: HTMLVideoElement) {
  if (!model) return [];
  const predictions = await model.detect(video);
  return predictions;
}
