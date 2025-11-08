import React, { useState } from "react";
import LogoAnimation from "./firstscreen";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Tracing from "./Tracing";

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
          <Route path="/" element={<Navigate to="/tracing" replace />} />
          <Route
            path="/tracing"
            element={<Tracing customShapes={customShapes} />}
          />
          {/*<Route path="/ShapeCreator" element= {}/>*/}
          {/*<Route path="/Tracing" element= {}/>*/}
          {/*<Route path="/Posture" element= {}/> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default ShapeTracingApp;
