import React, { useRef, useEffect, useState, useCallback } from "react";
import { Camera } from "lucide-react";
import { getBuiltInShapes } from "./shapeUtils";

const Tracing = ({ customShapes }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [coverage, setCoverage] = useState(0);

  const [currentShape, setCurrentShape] = useState("circle");
  const [finishedE, setfinishedE] = useState(false);
  const [fingerOnShape, setFingerOnShape] = useState(false);

  const tracedPointsRef = useRef(new Set());
  const handsRef = useRef(null);
  const currentShapeRef = useRef(currentShape);
  const hasTriggeredSuccessRef = useRef(false);

  useEffect(() => {
    currentShapeRef.current = currentShape;
  }, [currentShape]);

  const onResults = useCallback(
    (results) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, -width, 0, width, height);
      ctx.restore();

      const builtInShapes = getBuiltInShapes(width, height);
      const allShapes = { ...builtInShapes };
      customShapes.forEach((shape) => {
        allShapes[shape.name] = shape.points;
      });

      const targetShape =
        allShapes[currentShapeRef.current] || builtInShapes.circle;

      ctx.lineWidth = 4;
      for (let i = 0; i < targetShape.length - 1; i++) {
        const currentPoint = targetShape[i];
        const nextPoint = targetShape[i + 1];

        if (currentPoint === null || nextPoint === null) {
          continue;
        }

        const isTraced =
          tracedPointsRef.current.has(i) || tracedPointsRef.current.has(i + 1);
        ctx.strokeStyle = isTraced ? "#00ff00" : "#ffb400";
        ctx.beginPath();
        ctx.moveTo(currentPoint.x, currentPoint.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.stroke();
      }

      let onShape = false;

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];

        const indexTip = landmarks[8];
        const indexX = Math.floor((1 - indexTip.x) * width);
        const indexY = Math.floor(indexTip.y * height);

        const middleTip = landmarks[12];
        const middleY = Math.floor(middleTip.y * height);

        const indexExtended = indexY < middleY - 10;

        if (indexExtended) {
          let minDist = Infinity;
          let closestIdx = -1;

          for (let i = 0; i < targetShape.length; i++) {
            const point = targetShape[i];

            if (point === null) {
              continue;
            }

            const dx = indexX - point.x;
            const dy = indexY - point.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < minDist) {
              minDist = dist;
              closestIdx = i;
            }
          }

          const threshold = 15;
          if (minDist < threshold && closestIdx !== -1) {
            tracedPointsRef.current.add(closestIdx);
            onShape = true;

            ctx.beginPath();
            ctx.arc(indexX, indexY, 15, 0, 2 * Math.PI);
            ctx.strokeStyle = "#0B6623";
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.fillStyle = "#0B6623";
            ctx.beginPath();
            ctx.arc(indexX, indexY, 8, 0, 2 * Math.PI);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(indexX, indexY, 15, 0, 2 * Math.PI);
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.fillStyle = "#ff0000";
            ctx.beginPath();
            ctx.arc(indexX, indexY, 8, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }

      const validPointsCount = targetShape.filter((p) => p !== null).length;
      const newCoverage =
        validPointsCount > 0
          ? tracedPointsRef.current.size / validPointsCount
          : 0;
      setCoverage(newCoverage);
      setFingerOnShape(onShape);

      if (newCoverage >= 0.85 && !hasTriggeredSuccessRef.current) {
        hasTriggeredSuccessRef.current = true;
        setfinishedE(true);
        setTimeout(() => {
          setfinishedE(false);
          hasTriggeredSuccessRef.current = false;
        }, 3000);
      }
    },
    [customShapes]
  );

  const processFrame = useCallback(async () => {
    if (videoRef.current && handsRef.current && canvasRef.current) {
      await handsRef.current.send({ image: videoRef.current });
      requestAnimationFrame(processFrame);
    }
  }, []);

  useEffect(() => {
    // Store videoRef.current in a variable to fix cleanup warning
    const video = videoRef.current;

    const loadMediaPipe = async () => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
      script.crossOrigin = "anonymous";

      script.onload = async () => {
        const hands = new window.Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.75,
          minTrackingConfidence: 0.75,
        });

        hands.onResults(onResults);
        handsRef.current = hands;

        if (videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
          });
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setIsLoading(false);
            processFrame();
          };
        }
      };

      document.body.appendChild(script);
    };

    loadMediaPipe();

    // Use the stored variable in cleanup
    return () => {
      if (video?.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onResults, processFrame]);

  const handleReset = () => {
    tracedPointsRef.current.clear();
    setCoverage(0);

    setfinishedE(false);
    hasTriggeredSuccessRef.current = false;
  };

  const handleShapeChange = (shapeName) => {
    tracedPointsRef.current.clear();
    setCoverage(0);
    setfinishedE(false);
    hasTriggeredSuccessRef.current = false;
    setCurrentShape(shapeName);
  };

  const allShapeNames = [
    "circle",
    "square",
    "triangle",
    ...customShapes.map((s) => s.name),
  ];

  const getDisplayName = (name) => {
    const customShape = customShapes.find((s) => s.name === name);
    if (customShape) {
      return customShape.displayName;
    } else {
      return name.toUpperCase();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        <h2 className="text-3xl font-bold text-[#4c515c] mb-4 text-left pl-32">
          Alleviate Wrist Pain Through Tracing
        </h2>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="relative mb-4">
              <video
                ref={videoRef}
                className="hidden"
                width="640"
                height="480"
              />
              <canvas
                ref={canvasRef}
                width="640"
                height="480"
                className="w-full rounded-lg border-4 border-gray-300"
              />

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg">
                  <div className="text-white text-xl">
                    <Camera className="animate-pulse mx-auto mb-2" size={48} />
                    Loading the camera...
                  </div>
                </div>
              )}

              {finishedE && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <div className="text-green-400 text-5xl font-bold">
                    You completed the exercise!
                  </div>
                  <div className="text-green-400 text-4xl font-bold mt-4">
                    Choose another exercise to go again
                  </div>
                </div>
              )}

              <div className="text-center mt-2"></div>
            </div>
            <span
              className={`text-3xl font-semibold ml-[270px] ${
                fingerOnShape ? "text-green-600" : "text-orange-600"
              }`}
            >
              {fingerOnShape ? "✓ On Target!" : "Trace the line"}
            </span>
          </div>

          <div className="w-80 space-y-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <label className="block text-[#4c515c] font-semibold mb-2">
                Select Your Wrist Exercise:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {allShapeNames.map((name) => (
                  <button
                    key={name}
                    onClick={() => handleShapeChange(name)}
                    className={`px-4 py-3 rounded-lg font-semibold transition ${
                      currentShape === name
                        ? "bg-gradient-to-r from-[#B794F6] to-[#81C995] text-white"
                        : "bg-white text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {getDisplayName(name)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#4c515c] font-semibold text-lg">
                  Shape: {getDisplayName(currentShape)}
                </span>
                <span className="text-[#4c515c] font-semibold">
                  {Math.floor(coverage * 100)}%
                </span>
              </div>
              <div className="text-gray-600 text-sm mb-2">
                Need 85% to complete
              </div>
              <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    coverage >= 0.85 ? "bg-green-500" : "bg-[#FF9B7D]"
                  }`}
                  style={{ width: `${coverage * 100}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-[#B794F6] to-[#81C995] hover:from-[#B794F6] hover:to-[#81C995] text-white font-semibold py-2 px-6 rounded-lg transition w-full"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracing;
