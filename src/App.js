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
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadShape = async () => {
  //     try {
  //       const shapes = await loadShapes();
  //       setCustomShapes(shapes);
  //     } catch (error) {
  //       console.error("Failed to load shapes from Firebase:", error);
  //       const saved = localStorage.getItem("customShapes");
  //       if (saved) {
  //         setCustomShapes(JSON.parse(saved));
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadShape();
  // }, []); 
  // if (loading) {
  //   return <div>Loading exercises...</div>;
  // }

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
