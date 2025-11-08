//import React, { useState, useEffect } from "react";
import LogoAnimation from "./firstscreen";
import NavBar from "./navBar";
import { BrowserRouter, Routes, Route} from "react-router-dom";

const ShapeTracingApp = () => {
 
  return (
    <div>

    <BrowserRouter>
    <NavBar />
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

    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            First Demo Deploy
          </h1>
          </div>
        </div>
      </div>
      </div>
  );
};

export default ShapeTracingApp;