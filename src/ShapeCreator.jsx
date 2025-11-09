import React, { useRef, useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";

const ShapeCreator = ({ customShapes, setCustomShapes }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [shapeName, setShapeName] = useState("");

  const MIN_DISTANCE = 5; 

  const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (points.length > 1) {
      ctx.strokeStyle = "#201b1bff";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);


      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }

      if (points.length > 1) {
        const lastPoint = points[points.length - 1];
        ctx.lineTo(lastPoint.x, lastPoint.y);
      }

      ctx.stroke();
    }

    ctx.fillStyle = "#bb7adcff";
    ctx.font = "16px Arial";
    ctx.fillText(`Points: ${points.length}`, 10, 30);
  }, [points]);

  const addPoint = (x, y) => {
    if (points.length === 0) {
      setPoints([{ x, y }]);
    } else {
      const lastPoint = points[points.length - 1];
      const distance = getDistance(lastPoint, { x, y });

      if (distance >= MIN_DISTANCE) {
        setPoints([...points, { x, y }]);
      }
    }
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints([{ x, y }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addPoint(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDrawing(true);

    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setPoints([{ x, y }]);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    addPoint(x, y);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setPoints([]);
  };

  const saveExercise = () => {
    if (points.length < 10) {
      alert("Try to draw a longer trace! (Need at least 10 points)");
      return;
    }
    if (!shapeName.trim()) {
      alert("Please enter a name for your exercise!");
      return;
    }

    const simplified = points.filter((_, i) => i % 2 === 0);
    const thing2 = shapeName.trim().toLowerCase();
    const trimmed = shapeName.trim();

    const newShape = {
      name: thing2.replace(/\s+/g, "_"),
      displayName: trimmed,
      points: simplified,
      custom: true,
    };

    setCustomShapes([...customShapes, newShape]);
    setPoints([]);
    setShapeName("");
    alert(
      `Exercise: "${newShape.displayName}" saved! Go to Hand Exercises to try it.`
    );
  };

  const deleteShape = (shapeName) => {
    setCustomShapes(customShapes.filter((s) => s.name !== shapeName));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Create Your Own Trace
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Trace Name:
          </label>
          <input
            type="text"
            value={shapeName}
            onChange={(e) => setShapeName(e.target.value)}
            placeholder="e.g., Star, Loops etc."
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="mb-4 border-4 border-gray-300 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="w-full cursor-crosshair touch-none"
          />
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={clearCanvas}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
          >
            <Trash2 size={20} />
            Clear
          </button>
          <button
            onClick={saveExercise}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex-1"
          >
            <Plus size={20} />
            Save Shape
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-blue-800 font-semibold mb-2">Instructions:</p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Click and drag to draw the trace</li>
            <li>• Make your exercise clear and easy to trace</li>
            <li>• Give the exercise a unique name</li>
            <li>• Click "Save Trace" when done</li>
          </ul>
        </div>

        {customShapes && customShapes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Your Custom Wrist Exercises:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customShapes.map((shape) => (
                <div
                  key={shape.name}
                  className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
                >
                  <span className="font-semibold text-gray-800">
                    {shape.displayName}
                  </span>
                  <button
                    onClick={() => deleteShape(shape.name)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShapeCreator;
