import React, { useState } from "react";
import LogoAnimation from "./firstscreen";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Tracing from "./Tracing";
import ArthritisChatbot from "./Arthritis";
import ShapeCreator from "./ShapeCreator";
const ShapeTracingApp = () => {
  const [showAnimation, setShowAnimation] = useState(true);

  const [customShapes, setCustomShapes] = useState(() => {
    const saved = localStorage.getItem("customShapes");
    return saved ? JSON.parse(saved) : [];
  });

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };
  if (showAnimation) {
    return <LogoAnimation onComplete={handleAnimationComplete} />;
  }
  return (
    <BrowserRouter>
      <div className="pages">
        <Routes>
          <Route path="/" element={<Navigate to="/ai" replace />} />
          <Route
            path="/tracing"
            element={<Tracing customShapes={customShapes} />}
          />
          <Route path="/ai" element={<ArthritisChatbot />} />
          <Route
            path="/shapecreator"
            element={
              <ShapeCreator
                customShapes={customShapes}
                setCustomShapes={setCustomShapes}
              />
            }
          />
          {/*<Route path="/Posture" element= {}/> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default ShapeTracingApp;
