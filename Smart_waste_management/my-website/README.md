♻️ Smart Waste Detection

A web-based application that detects recyclable objects in real-time using a webcam and highlights them with bounding boxes. Developed using Next.js, TensorFlow.js, and COCO-SSD model.

Features

Detects objects like bottles, books, cups, handbags, laptops, etc.

Shows material type and recyclable status inside bounding boxes.

Counts the total objects detected and shows a breakdown per type.

Live camera detection.

Easy setup for Windows and Linux.

Technologies Used

Next.js – React-based framework for building the frontend.

TypeScript – Static typing for safer code.

TensorFlow.js – JavaScript library for ML in the browser.

COCO-SSD – Pre-trained object detection model.

HTML5 Canvas – For drawing bounding boxes and labels.

Default Objects Detected by COCO-SSD

The default TensorFlow COCO-SSD model can detect 80 objects including:

person, bicycle, car, motorcycle, airplane, bus, train, truck, boat, traffic light, fire hydrant, stop sign, parking meter, bench, bird, cat, dog, horse, sheep, cow, elephant, bear, zebra, giraffe, backpack, umbrella, handbag, tie, suitcase, frisbee, skis, snowboard, sports ball, kite, baseball bat, baseball glove, skateboard, surfboard, tennis racket, bottle, wine glass, cup, fork, knife, spoon, bowl, banana, apple, sandwich, orange, broccoli, carrot, hot dog, pizza, donut, cake, chair, couch, potted plant, bed, dining table, toilet, tv, laptop, mouse, remote, keyboard, cell phone, microwave, oven, toaster, sink, refrigerator, book, clock, vase, scissors, teddy bear, hair drier, toothbrush.

You can add custom objects by retraining the model or filtering results in code.

Setup Instructions
Prerequisites

Node.js 

npm (comes with Node.js)

Webcam (for live detection)

Installation (Windows)

Open PowerShell in the project folder.

Allow script execution:

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass


Run the installation script:

.\install-windows.ps1


Start the app:

npm run dev


Open http://localhost:3000
 in your browser.

Installation (Ubuntu/Linux)

Open terminal in the project folder.

Make the script executable:

chmod +x install-ubuntu.sh


Run the installation script:

./install-ubuntu.sh


Start the app:

npm run dev


Open http://localhost:3000
 in your browser.

Usage

Open the webpage in a browser.

Grant camera permissions.

The app will detect objects in real-time.

Green bounding boxes will show:

Object name

Material

Recyclable status

The detections panel shows:

Total objects detected

Count per object type

Custom Object Detection

To detect objects not included by default (e.g., thin plastic pouches or bags):

You need a custom trained TensorFlow.js model.

Replace COCO-SSD model loading in utils/tfModel.ts with your custom model.

Add object info (material & recyclable status) to OBJECT_INFO in pages/index.tsx.

File Structure
Smart_waste_management/
├─ pages/
│  ├─ index.tsx
├─ utils/
│  ├─ tfModel.ts
├─ install-windows.ps1
├─ install-ubuntu.sh
├─ package.json
├─ tsconfig.json
└─ README.md

License

MIT License – feel free to use, modify, and distribute.