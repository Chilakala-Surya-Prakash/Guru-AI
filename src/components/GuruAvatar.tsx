import { motion } from "motion/react";
import { Sparkles, Volume2, Lightbulb } from "lucide-react";

interface GuruAvatarProps {
  isSpeaking: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  mood?: "welcoming" | "explaining" | "thinking" | "celebrating";
  showPointer?: boolean;
}

export function GuruAvatar({
  isSpeaking,
  size = "md",
  mood = "welcoming",
  showPointer = false,
}: GuruAvatarProps) {
  const containerSizes = {
    sm: "w-10 h-10 rounded-2xl border-2",
    md: "w-16 h-16 rounded-3xl border-3",
    lg: "w-28 h-28 rounded-[2.5rem] border-4",
    xl: "w-44 h-44 rounded-[3.5rem] border-4",
  }[size];

  const eyeSizes = {
    sm: "w-1.5 h-2.5",
    md: "w-2 h-3.5",
    lg: "w-3 h-5",
    xl: "w-4 h-6",
  }[size];

  const mouthSizes = {
    sm: "w-3 h-1.5",
    md: "w-5 h-2.5",
    lg: "w-8 h-3.5",
    xl: "w-12 h-4",
  }[size];

  return (
    <div className="relative inline-flex items-center justify-center select-none" id="guru-avatar-container">
      {/* Playful Floating Pastel Backdrops (from Design Spec) */}
      {size === "xl" && (
        <>
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#FF7675] rounded-full opacity-30 blur-xs pointer-events-none" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#74B9FF] rounded-full opacity-30 blur-xs pointer-events-none" />
        </>
      )}

      {/* Outer pulsing glow aura when speaking */}
      {isSpeaking && (
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-[#6C5CE7]/30 blur-xl pointer-events-none"
        />
      )}

      {/* Main Avatar Character Body */}
      <motion.div
        animate={
          isSpeaking
            ? {
                y: [0, -6, 0],
                rotate: [0, -2, 2, 0],
              }
            : {
                y: [0, -3, 0],
              }
        }
        transition={{
          duration: isSpeaking ? 0.7 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`relative bg-white border-[#6C5CE7] shadow-xl flex items-center justify-center ${containerSizes}`}
      >
        <div className="flex flex-col items-center justify-center gap-1.5 md:gap-2">
          {mood === "thinking" ? (
            <Lightbulb size={size === "xl" ? 44 : size === "lg" ? 30 : 20} className="animate-pulse text-[#F1C40F]" />
          ) : mood === "celebrating" ? (
            <Sparkles size={size === "xl" ? 44 : size === "lg" ? 30 : 20} className="text-[#FF7675] animate-spin" />
          ) : (
            <>
              {/* Cute Pill Eyes */}
              <div className="flex gap-2.5 md:gap-4 items-center">
                <motion.div
                  animate={
                    isSpeaking
                      ? { scaleY: [1, 0.2, 1] }
                      : { scaleY: [1, 1, 0.1, 1] }
                  }
                  transition={{
                    duration: isSpeaking ? 2 : 4,
                    repeat: Infinity,
                    times: isSpeaking ? [0, 0.5, 1] : [0, 0.85, 0.9, 1],
                  }}
                  className={`${eyeSizes} bg-[#2D3436] rounded-full`}
                />
                <motion.div
                  animate={
                    isSpeaking
                      ? { scaleY: [1, 0.2, 1] }
                      : { scaleY: [1, 1, 0.1, 1] }
                  }
                  transition={{
                    duration: isSpeaking ? 2 : 4,
                    repeat: Infinity,
                    times: isSpeaking ? [0, 0.5, 1] : [0, 0.85, 0.9, 1],
                  }}
                  className={`${eyeSizes} bg-[#2D3436] rounded-full`}
                />
              </div>

              {/* Cheerful Animated Coral Mouth */}
              <motion.div
                animate={
                  isSpeaking
                    ? {
                        scaleY: [0.6, 2.2, 0.8, 1.8, 0.6],
                        scaleX: [1, 1.2, 0.9, 1.1, 1],
                        borderRadius: ["9999px", "12px", "9999px", "14px", "9999px"],
                      }
                    : {
                        scaleY: 1,
                        scaleX: 1,
                      }
                }
                transition={{
                  duration: 0.35,
                  repeat: isSpeaking ? Infinity : 0,
                }}
                className={`${mouthSizes} bg-[#FF7675] rounded-full mt-0.5`}
              />
            </>
          )}
        </div>

        {/* Sound Waves Badge when speaking */}
        {isSpeaking && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 bg-[#55EFC4] text-[#2D3436] p-1 rounded-full border-2 border-white shadow-sm"
          >
            <Volume2 size={size === "xl" ? 14 : 10} className="animate-pulse" />
          </motion.div>
        )}
      </motion.div>

      {/* Pointer stick when explaining */}
      {showPointer && (
        <motion.div
          animate={{
            rotate: [15, 25, 15],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-4 -bottom-1 w-9 h-1.5 bg-[#F1C40F] origin-left rounded-full shadow-sm pointer-events-none hidden sm:block border border-white"
        >
          <div className="absolute right-0 -top-1 w-2.5 h-3.5 bg-[#FF7675] rounded-sm" />
        </motion.div>
      )}
    </div>
  );
}
