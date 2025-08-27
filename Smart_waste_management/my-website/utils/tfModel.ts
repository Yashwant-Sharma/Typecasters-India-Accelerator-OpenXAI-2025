import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

let model: cocoSsd.ObjectDetection | null = null;

export async function loadModel() {
  if (!model) {
    model = await cocoSsd.load();
    console.log("✅ Model loaded");
  }
}

export async function detectObjects(element: HTMLVideoElement) {
  if (!model) await loadModel();
  if (!model) return [];

  // Check valid video size
  if (element.videoWidth === 0) return [];

  return await model.detect(element);
}
