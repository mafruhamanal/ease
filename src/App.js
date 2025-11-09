import React, { useState, useEffect } from "react";
import LogoAnimation from "./firstscreen";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Tracing from "./Tracing";
import ArthritisChatbot from "./Arthritis";
import ShapeCreator from "./ShapeCreator";
const ShapeTracingApp = () => {

  const [customShapes, setCustomShapes] = useState(() => {
    const saved = localStorage.getItem("customShapes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("customShapes", JSON.stringify(customShapes));
  }, [customShapes]);

  return (
    <BrowserRouter>
      <div className="pages">
        <Routes>
          <Route path="/" element={<LogoAnimation/>} />
          <Route path="/ai" element={<ArthritisChatbot />} />
          <Route
            path="/tracing"
            element={<Tracing customShapes={customShapes} />}
          />
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
