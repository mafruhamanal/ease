import React, { useState } from "react";
//import {useEffect} from "react";
//import { loadShapes } from "./firebaseShapes";
import LogoAnimation from "./firstscreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tracing from "./Tracing";
import ArthritisChatbot from "./Arthritis";
import ShapeCreator from "./ShapeCreator";
import NavBar from "./navBar";
import FingerTouchExercise from "./Exercise";
const ShapeTracingApp = () => {

  const [customShapes, setCustomShapes] = useState([]);

  return (
    <BrowserRouter>
      <div className="pages">
        <NavBar/>
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
          <Route path="/posture" element= {<FingerTouchExercise/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default ShapeTracingApp;
