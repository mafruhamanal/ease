import React, { useState, useEffect } from "react";
import LogoAnimation from "./firstscreen";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import TracingGame from "./Tracing";
const ShapeTracingApp = () => {
  
  const [customShapes, setCustomShapes] = useState(() => {
    const saved = localStorage.getItem("customShapes");
    return saved ? JSON.parse(saved) : [];
  });

  return (
    <div>
    <BrowserRouter>
    <div className= "pages"> 
      <Routes>
        {/*<Route path="/" element= {}/>*/}
        <Route path="/Landing" element= {<LogoAnimation/>} />
        {/*<Route path="/ShapeCreator" element= {}/>
        <Route path="/Tracing" element= {}/>
        <Route path="/Posture" element= {}/> */}
      </Routes>
    </div>
    </BrowserRouter>
    <LogoAnimation/> 

    </div>
  );
};

export default ShapeTracingApp;