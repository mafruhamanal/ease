import React, { useRef, useEffect, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { saveShapes, deleteShape as deleteShapeFromDB } from "./firebaseShapes";

const ShapeCreator = ({ customShapes, setCustomShapes }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const [shapeName, setShapeName] = useState("");
  const strokesRef = useRef([]);

  const MIN_DISTANCE = 5;

  const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  const getTotalPoints = () => {
    return strokes.reduce((total, stroke) => total + stroke.length, 0);
  };

  useEffect(() => {
    strokesRef.current = strokes;
  }, [strokes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((stroke) => {
      if (stroke.length > 1) {
        ctx.strokeStyle = "#201b1bff";
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);

        for (let i = 1; i < stroke.length - 1; i++) {
          const xc = (stroke[i].x + stroke[i + 1].x) / 2;
          const yc = (stroke[i].y + stroke[i + 1].y) / 2;
          ctx.quadraticCurveTo(stroke[i].x, stroke[i].y, xc, yc);
        }

        if (stroke.length > 1) {
          const lastPoint = stroke[stroke.length - 1];
          ctx.lineTo(lastPoint.x, lastPoint.y);
        }

        ctx.stroke();
      }
    });

    const totalPoints = strokes.reduce(
      (total, stroke) => total + stroke.length,
      0
    );

    ctx.fillStyle = "#bb7adcff";
    ctx.font = "16px Arial";
    ctx.fillText(`Points: ${totalPoints}`, 10, 30);
  }, [strokes]);

  const addPoint = (x, y) => {
    setStrokes((prevStrokes) => {
      if (prevStrokes.length === 0) return prevStrokes;

      const currentStroke = prevStrokes[prevStrokes.length - 1];

      if (currentStroke.length === 0) {
        const newStrokes = [...prevStrokes];
        newStrokes[newStrokes.length - 1] = [{ x, y }];
        return newStrokes;
      } else {
        const lastPoint = currentStroke[currentStroke.length - 1];
        const distance = getDistance(lastPoint, { x, y });

        if (distance >= MIN_DISTANCE) {
          const newStrokes = [...prevStrokes];
          newStrokes[newStrokes.length - 1] = [...currentStroke, { x, y }];
          return newStrokes;
        }
      }

      return prevStrokes;
    });
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setStrokes((prev) => [...prev, [{ x, y }]]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    addPoint(x, y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsDrawing(true);

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;

    setStrokes((prev) => [...prev, [{ x, y }]]);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;
    addPoint(x, y);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setStrokes([]);
  };

  const saveExercise = async () => {
    const totalPoints = getTotalPoints();

    if (totalPoints < 10) {
      alert("Try to draw a longer trace! (Need at least 10 points)");
      return;
    }
    if (!shapeName.trim()) {
      alert("Please enter a name for your exercise!");
      return;
    }

    const allPoints = [];
    strokes.forEach((stroke, strokeIndex) => {
      const simplified = stroke.filter((_, i) => i % 2 === 0);
      simplified.forEach((point) => {
        allPoints.push(point);
      });

      if (strokeIndex < strokes.length - 1) {
        allPoints.push(null);
      }
    });

    const thing2 = shapeName.trim().toLowerCase();
    const trimmed = shapeName.trim();

    const newShapeData = {
      name: thing2.replace(/\s+/g, "_"),
      displayName: trimmed,
      points: allPoints,
      custom: true,
    };

    try {
      const savedShape = await saveShapes(newShapeData);
      setCustomShapes([...customShapes, savedShape]);
      setStrokes([]);
      setShapeName("");
      alert(
        `Exercise: "${savedShape.displayName}" saved! Go to Hand Exercises to try it.`
      );
    } catch (error) {
      console.error("Failed to save shape:", error);
      alert("Error: Could not save the exercise. Please try again.");
    }
  };
  const deleteShape = async (shapeId) => {
    try {
      await deleteShapeFromDB(shapeId);

      setCustomShapes(customShapes.filter((s) => s.id !== shapeId));
    } catch (error) {
      console.error("Failed to delete shape:", error);
      alert("Error: Could not delete the shape. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-2xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Create Your Own Trace
        </h2>
       
       <div className="flex gap-6">

        {/*left side */}
        <div className= "w-80 space-y-4">
        {/*Trace name */}
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

        {/*instruction part */}
       <div className="bg-blue-50 border-l-4 border-blue-500 p-4"> 
          <p className="text-blue-800 font-semibold mb-2">Instructions:</p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Give the exercise a unique name</li>
            <li>• Click and drag to draw the trace on the canvas to the right</li>
            <li>• Make your exercise clear and easy to trace</li>
            <li>• Click "Save Trace" when done</li>
          </ul>
        </div>

       {/*clear button */}
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
          >
            <Trash2 size={20} />
            Clear
          </button>

       {/*save shape button */}
          <button
            onClick={saveExercise}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B794F6] to-[#81C995] hover:from-[#B794F6] hover:to-[#81C995] text-white font-semibold rounded-lg transition flex-1"
          >
            <Plus size={20} />
            Save Shape
          </button>
        </div>

        </div>
        {/*right side */} 
        {/*Canvas to draw */} 
        <div className="flex-1">
          <div className="relative">
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
             className="w-full h-auto border-4 border-gray-300 rounded-lg cursor-crosshair touch-none"
            />
          </div>
        </div>
      </div>

       
       {/*new created shapes */}
        {customShapes && customShapes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Your Custom Wrist Exercises:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customShapes.map((shape) => (
                <div
                  key={shape.id} 
                  className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
                >
                  <span className="font-semibold text-gray-800">
                    {shape.displayName}
                  </span>
                  <button
                    onClick={() => deleteShape(shape.id)} 
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