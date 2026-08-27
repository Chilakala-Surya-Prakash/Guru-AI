import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Sparkles,
  Compass,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import { LessonStep } from "../types";

interface StepExplainerProps {
  steps: LessonStep[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  isSpeaking: boolean;
  onReadStep: () => void;
  // speechScripts removed (BUG-10): was declared but never consumed; narration driven by onReadStep callback
}

export function StepExplainer({
  steps,
  currentStepIndex,
  onStepChange,
  isSpeaking,
  onReadStep,
}: StepExplainerProps) {
  const currentStep = steps[currentStepIndex];

  return (
    <div
      className="rounded-[2.5rem] bg-white border-4 border-[#FFEAA7] p-6 md:p-8 shadow-xl text-[#2D3436] flex flex-col justify-between h-full relative"
      id="step-explainer-card"
    >
      {/* Top Stepper Progress Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 pb-4 border-b-2 border-[#FFEAA7] flex-wrap">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#FFEAA7] text-[#2D3436] text-xs font-black uppercase tracking-wider">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onReadStep}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FFF9E3] border-2 border-[#FFEAA7] text-xs font-bold text-[#2D3436] transition-all shadow-xs cursor-pointer"
            id="read-step-voice-btn"
          >
            {isSpeaking ? <VolumeX size={14} className="text-[#FF7675]" /> : <Volume2 size={14} className="text-[#6C5CE7]" />}
            <span>{isSpeaking ? "Pause Narration" : "Listen to Step"}</span>
          </button>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-2 my-4 overflow-x-auto pb-1" id="step-indicators-list">
          {steps.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onStepChange(idx)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all shrink-0 cursor-pointer ${
                idx === currentStepIndex
                  ? "bg-[#6C5CE7] text-white shadow-md scale-110 ring-4 ring-[#6C5CE7]/15"
                  : idx < currentStepIndex
                  ? "bg-[#55EFC4] text-[#2D3436] font-bold border-2 border-white"
                  : "bg-white border-2 border-[#FFEAA7] text-[#636E72] hover:border-[#6C5CE7]"
              }`}
              title={`Jump to Step ${idx + 1}: ${s.title}`}
              id={`step-pill-${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 my-4"
          >
            <h3 className="text-xl md:text-2xl font-black text-[#2D3436] tracking-tight">
              {currentStep.title}
            </h3>

            <p className="text-sm md:text-base text-[#2D3436] leading-relaxed font-medium">
              {currentStep.content}
            </p>

            {/* Real-World Concrete Example */}
            <div className="p-5 rounded-3xl bg-[#FFEDED] border-2 border-[#FFD3D3] shadow-xs">
              <p className="text-xs font-black uppercase tracking-wider text-[#EB4D4B] mb-1.5 flex items-center gap-1.5">
                <Compass size={15} />
                Real-World Example:
              </p>
              <p className="text-xs md:text-sm text-[#2D3436] font-medium leading-relaxed">
                {currentStep.example}
              </p>
            </div>

            {/* Key Golden Takeaway */}
            <div className="p-4 rounded-2xl bg-[#DFF9FB] border-2 border-[#55EFC4] flex items-start gap-2.5 shadow-xs">
              <CheckCircle size={18} className="text-[#00B894] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#22A6B3] block">
                  Key Takeaway:
                </span>
                <span className="text-xs md:text-sm text-[#2D3436] font-bold leading-snug">
                  {currentStep.keyTakeaway}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-[#FFEAA7] mt-4">
        <button
          type="button"
          onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
          disabled={currentStepIndex === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-full border-2 border-[#FFEAA7] bg-white text-xs font-bold text-[#2D3436] hover:bg-[#FFF9E3] hover:border-[#6C5CE7] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
          id="prev-step-btn"
        >
          <ChevronLeft size={16} />
          <span>Previous Step</span>
        </button>

        <span className="text-xs font-black text-[#A0A0A0]">
          {currentStepIndex + 1} / {steps.length}
        </span>

        <button
          type="button"
          onClick={() => onStepChange(Math.min(steps.length - 1, currentStepIndex + 1))}
          disabled={currentStepIndex === steps.length - 1}
          className="flex items-center gap-1 px-5 py-2.5 rounded-full bg-[#6C5CE7] hover:bg-[#5849C4] text-xs font-black text-white transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          id="next-step-btn"
        >
          <span>Next Step</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
