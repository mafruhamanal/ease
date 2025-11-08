import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function LogoAnimation() {
  const [stage, setStage] = useState(0);

  const phrase = "Enhanced Arthritis Support & Exercise";
  const words = phrase.split(" ");

  // First letters of each word => E A S E
  const firstLetters = words.map((w) => w[0]);

  useEffect(() => {
    const s1 = setTimeout(() => setStage(1), 2000); // fade interior letters
    const s2 = setTimeout(() => setStage(2), 4000); // form EASE
    const s3 = setTimeout(() => (window.location.href = "/"), 6500);

    return () => {
      clearTimeout(s1);
      clearTimeout(s2);
      clearTimeout(s3);
    };
  }, []);

  const gradientTextStyle = {
    background: "linear-gradient(to right, #81C995, #60a5fa, #B794F6)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#FAFBFC" }}
    >
      <div className="text-center">
        {/* ===== STAGE 0 & 1: Full sentence + fading letters ===== */}
        {stage < 2 && (
          <motion.div
            className="font-body"
            style={{
              ...gradientTextStyle,
              fontSize: "4rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
              display: "inline-block",
            }}
          >
            {words.map((word, wi) => {
              const firstLetter = word[0];

              return (
                <span key={wi} style={{ marginRight: "12px" }}>
                  {word.split("").map((char, ci) => {
                    const keep = ci === 0;

                    return (
                      <motion.span
                        key={ci}
                        animate={{
                          opacity: stage === 0 ? 1 : keep ? 1 : 0,
                        }}
                        transition={{ duration: 0.45 }}
                        style={{
                          display: "inline-block",
                        }}
                      >
                        {char}
                      </motion.span>
                    );
                  })}
                </span>
              );
            })}
          </motion.div>
        )}

        {/* ===== STAGE 2: Full EASE word slides together smoothly ===== */}
        {stage === 2 && (
          <motion.div
            className="font-heading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            style={{
              ...gradientTextStyle,
              fontSize: "6rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {firstLetters.map((char, i) => (
              <motion.span
                key={i}
                initial={{ x: (i - 1.5) * 160 }} // start in spaced-out positions
                animate={{ x: 0 }} // slide into EASE
                transition={{
                  duration: 0.9,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{
                  display: "inline-block",
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
