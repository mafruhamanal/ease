import React, { useRef, useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";

const ShapeCreator = ({ customShapes, setCustomShapes, onComplete }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [shapeName, setShapeName] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (points.length > 1) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(`Points: ${points.length}`, 10, 30);
  }, [points]);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints([...points, { x, y }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints([...points, { x, y }]);
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
    setPoints([...points, { x, y }]);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setPoints([...points, { x, y }]);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setPoints([]);
  };

  const saveShape = () => {
    if (points.length < 10) {
      alert("Draw a longer shape! (Need at least 10 points)");
      return;
    }
    if (!shapeName.trim()) {
      alert("Please enter a name for your shape!");
      return;
    }

    // Simplify points (keep every 3rd point)
    const simplified = points.filter((_, i) => i % 3 === 0);

    const newShape = {
      name: shapeName.trim().toLowerCase().replace(/\s+/g, "_"),
      displayName: shapeName.trim(),
      points: simplified,
      custom: true,
    };

    setCustomShapes([...customShapes, newShape]);
    setPoints([]);
    setShapeName("");
    alert(`Shape "${newShape.displayName}" saved! Go to Play Game to try it.`);
  };

  const deleteShape = (shapeName) => {
    setCustomShapes(customShapes.filter((s) => s.name !== shapeName));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          ✏️ Create Your Own Shape
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Shape Name:
          </label>
          <input
            type="text"
            value={shapeName}
            onChange={(e) => setShapeName(e.target.value)}
            placeholder="e.g., Star, Lightning, Smiley"
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
            onClick={saveShape}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition flex-1"
          >
            <Plus size={20} />
            Save Shape
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="text-blue-800 font-semibold mb-2">Instructions:</p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Click and drag to draw your shape</li>
            <li>• Make it clear and easy to trace</li>
            <li>• Give it a unique name</li>
            <li>• Click "Save Shape" when done</li>
          </ul>
        </div>

        {customShapes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Your Custom Shapes:
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
