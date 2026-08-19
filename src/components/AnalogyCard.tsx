import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
  Smile,
  Zap,
  BookOpen,
} from "lucide-react";
import { TopicExplanation } from "../types";
import { fetchSimplerAnalogy } from "../services/api";

interface AnalogyCardProps {
  lesson: TopicExplanation;
  isSpeaking: boolean;
  onStartSpeech: (text: string) => void;
}

export function AnalogyCard({
  lesson,
  isSpeaking,
  onStartSpeech,
}: AnalogyCardProps) {
  const [simplifiedText, setSimplifiedText] = useState<string | null>(null);
  const [isSimplifying, setIsSimplifying] = useState(false);

  const handleHearAnalogy = () => {
    const textToSpeak =
      simplifiedText ||
      `Here is the analogy for ${lesson.title}: ${lesson.analogy.title}. Think of it like this: ${lesson.analogy.story}. In this story, ${lesson.analogy.mapping.map((m) => `${m.analogyItem} represents ${m.concept}`).join(", and ")}.`;

    onStartSpeech(textToSpeak);
  };

  const handleMakeSimpler = async () => {
    try {
      setIsSimplifying(true);
      const res = await fetchSimplerAnalogy(lesson.topic, lesson.analogy.story);
      setSimplifiedText(res.superSimpleAnalogy || res.everydayStory);
      onStartSpeech(
        `Let's make it super simple: ${res.superSimpleAnalogy || res.everydayStory}`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimplifying(false);
    }
  };

  return (
    <div
      className="rounded-[2.5rem] bg-white border-4 border-[#FAB1A0] p-6 md:p-8 shadow-xl text-[#2D3436] relative overflow-hidden"
      id="analogy-card-container"
    >
      {/* Decorative top-right pastel circle */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#FFEAA7]/40 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-4 pb-6 border-b-2 border-[#FFEAA7] flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#FFEDED] text-[#EB4D4B] border-2 border-[#FFD3D3] rounded-3xl flex items-center justify-center shadow-xs">
            <Lightbulb size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-black tracking-wider px-3 py-1 rounded-full bg-[#FFEAA7] text-[#2D3436]">
                Core Analogy
              </span>
              <span className="text-xs font-bold text-[#636E72]">
                Metaphor: {lesson.analogy.metaphor}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#2D3436] tracking-tight">
              {lesson.analogy.title}
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleHearAnalogy}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6C5CE7] hover:bg-[#5849C4] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            id="hear-analogy-btn"
          >
            {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span>{isSpeaking ? "Pause Voice" : "Hear Analogy"}</span>
          </button>

          <button
            type="button"
            onClick={handleMakeSimpler}
            disabled={isSimplifying}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#FFF9E3] border-2 border-[#FFEAA7] text-xs font-bold text-[#2D3436] transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
            id="make-simpler-btn"
          >
            <Smile size={15} className="text-[#FF7675]" />
            <span>{isSimplifying ? "Simplifying..." : "Make It Even Simpler"}</span>
          </button>
        </div>
      </div>

      {/* Story Text Box */}
      <div className="relative z-10 my-6">
        <div className="p-6 md:p-8 rounded-3xl bg-[#FFF9E3] border-2 border-[#FFEAA7] shadow-xs">
          <p className="text-xs font-black uppercase tracking-wider text-[#6C5CE7] mb-2 flex items-center gap-1.5">
            <BookOpen size={16} />
            The Story:
          </p>
          <p className="text-base md:text-xl text-[#2D3436] font-medium leading-relaxed">
            {simplifiedText || lesson.analogy.story}
          </p>

          {simplifiedText && (
            <div className="mt-4 p-3 rounded-2xl bg-white border border-[#FFEAA7] flex items-center justify-between text-xs text-[#636E72] font-semibold">
              <span>✨ Ultra-simplified version active.</span>
              <button
                type="button"
                onClick={() => setSimplifiedText(null)}
                className="text-[#6C5CE7] hover:underline font-bold"
              >
                Reset to Original Story
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Concept Mapping Grid */}
      <div className="relative z-10 mt-6">
        <h3 className="text-sm font-black uppercase tracking-wider text-[#A0A0A0] mb-4 flex items-center gap-1.5">
          <Zap size={16} className="text-[#F1C40F]" />
          How the Story Maps to the Real World:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lesson.analogy.mapping.map((mapping, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 rounded-2xl bg-[#DFF9FB] border-2 border-[#C7ECEE] shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[#C7ECEE]">
                <span className="text-xs font-black uppercase text-[#22A6B3]">
                  In the Analogy
                </span>
                <ArrowRight size={14} className="text-[#22A6B3]" />
                <span className="text-xs font-black uppercase text-[#6C5CE7]">
                  In Reality
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-sm md:text-base font-bold text-[#2D3436]">
                  {mapping.analogyItem}
                </span>
                <span className="text-sm md:text-base font-black text-[#6C5CE7] text-right">
                  {mapping.concept}
                </span>
              </div>

              {mapping.takeaway && (
                <p className="mt-2 text-xs text-[#636E72] font-medium leading-normal">
                  {mapping.takeaway}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
