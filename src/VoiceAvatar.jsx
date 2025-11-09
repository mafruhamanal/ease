import { motion } from "framer-motion";

export default function VoiceAvatar({ isTalking }) {
  return (
    <motion.div
      className="w-40 h-40 mx-auto relative"
      animate={
        isTalking
          ? {
              scale: [1, 1.2, 1.1, 1.25, 1],
              borderRadius: ["40% 60% 55% 45%", "55% 45% 65% 35%", "40% 60% 45% 55%"],
            }
          : {
              scale: [1, 1.05, 1],
              borderRadius: ["45% 55% 50% 50%", "50% 50% 45% 55%", "45% 55% 50% 50%"],
            }
      }
      transition={{
        duration: isTalking ? 0.8 : 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        background: "linear-gradient(135deg, #b794f6, #81c995)",
      }}
    >
      {/* Inner glowing pulse */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          opacity: isTalking ? [0.4, 0.8, 0.4] : [0.2, 0.3, 0.2],
          scale: isTalking ? [1, 1.3, 1] : [1, 1.05, 1],
        }}
        transition={{ duration: isTalking ? 1 : 3, repeat: Infinity }}
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.4), transparent)",
        }}
      />
    </motion.div>
  );
}
