import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// 1. Accept `onComplete` as a prop
export default function LogoAnimation({ onComplete }) {
  const [stage, setStage] = useState(0);

  const phrase = "Enhanced Arthritis Support & Exercise";
  const words = phrase.split(" ");
  const firstLetters = words.map((w) => w[0]);

  useEffect(() => {
    const s1 = setTimeout(() => setStage(1), 2500); 
    const s2 = setTimeout(() => setStage(2), 3500); 
    const s3 = setTimeout(() => setStage(3), 5800); 
    

    // 2. Add a new timeout to call onComplete when the animation ends
    // (5800ms start + 1200ms duration = 7000ms)
    const s4 = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 7000);

    return () => {
      clearTimeout(s1);
      clearTimeout(s2);
      clearTimeout(s3);
      clearTimeout(s4); // 3. Don't forget to clear the new timeout
    };
  }, [onComplete]); // 4. Add onComplete to the dependency array

  const gradientTextStyle = {
    background: "linear-gradient(to right, #81C995, #60a5fa, #B794F6)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  };
  

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      <div className="text-center overflow-hidden">
        {/* ===== First Frame: Full Phrase ===== */}
        {stage < 2 && (
          <motion.div
            className="font-body"
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: stage === 1 ? 0 : 1,
              y: stage === 1 ? 0 : 0, 
            }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              ...gradientTextStyle,
              fontSize: "4rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {phrase}
          </motion.div>
        )}

        {/* ===== Last Frame: Acronym "EAS&E" ===== */}
        {stage >= 2 && (
          <motion.div
            className="font-heading"
            initial={{ opacity: 0 }} 
            animate={{
              opacity: stage === 3 ? 0 : 1, 
              y: stage === 3 ? 60 : 0, 
            }}
            transition={{
              duration: 1.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{
              ...gradientTextStyle,
              fontSize: "12rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            {firstLetters.join("")}
          </motion.div>
        )}
      </div>
    </div>
  );
}