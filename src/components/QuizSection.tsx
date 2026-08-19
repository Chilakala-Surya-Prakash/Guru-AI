import { useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import {
  Trophy,
  CheckCircle,
  XCircle,
  Sparkles,
  RotateCcw,
  HelpCircle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { QuizQuestion } from "../types";

interface QuizSectionProps {
  quiz: QuizQuestion[];
  topic: string;
}

export function QuizSection({ quiz, topic }: QuizSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState<{ [key: number]: boolean }>({});
  const [showHint, setShowHint] = useState<{ [key: number]: boolean }>({});
  const [score, setScore] = useState<number | null>(null);

  const currentQ = quiz[currentIdx];
  const totalQuestions = quiz.length;

  const handleSelectOption = (optIndex: number) => {
    if (selectedAnswers[currentIdx] !== undefined) return; // already answered

    const updated = { ...selectedAnswers, [currentIdx]: optIndex };
    setSelectedAnswers(updated);
    setShowExplanation({ ...showExplanation, [currentIdx]: true });

    if (optIndex === currentQ.correctAnswer) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#6C5CE7", "#55EFC4", "#FFEAA7", "#FF7675", "#74B9FF"],
      });
    }
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate score
      let correctCount = 0;
      quiz.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswer) {
          correctCount++;
        }
      });
      setScore(correctCount);

      if (correctCount === totalQuestions) {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#6C5CE7", "#55EFC4", "#FFEAA7", "#FF7675", "#74B9FF"],
        });
      }
    }
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setShowExplanation({});
    setShowHint({});
    setScore(null);
  };

  return (
    <div
      className="rounded-[2.5rem] bg-white border-4 border-[#FFEAA7] p-6 md:p-8 shadow-xl text-[#2D3436] relative overflow-hidden"
      id="quiz-section-container"
    >
      {/* Decorative top pastel bubble */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#55EFC4]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b-2 border-[#FFEAA7] flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFF9E3] text-[#F1C40F] border-2 border-[#FFEAA7] rounded-2xl flex items-center justify-center shadow-xs">
            <Trophy size={26} />
          </div>
          <div>
            <span className="text-xs uppercase font-black tracking-wider text-[#6C5CE7]">
              Check for Understanding
            </span>
            <h3 className="text-xl md:text-2xl font-black text-[#2D3436]">
              Guru Mini-Quiz: {topic}
            </h3>
          </div>
        </div>

        {score === null && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-[#FFEAA7] text-[#2D3436]">
              Question {currentIdx + 1} of {totalQuestions}
            </span>
          </div>
        )}
      </div>

      {score === null ? (
        <div className="relative z-10 my-6">
          {/* Question Box */}
          <div className="p-5 rounded-3xl bg-[#FFFAF0] border-2 border-[#FFEAA7] mb-6">
            <h4 className="text-lg md:text-xl font-bold text-[#2D3436] leading-snug">
              {currentQ.question}
            </h4>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIdx] === optIdx;
              const hasAnswered = selectedAnswers[currentIdx] !== undefined;
              const isCorrect = optIdx === currentQ.correctAnswer;

              let btnStyle = "bg-[#FFFAF0] border-2 border-[#FFEAA7] text-[#2D3436] hover:bg-[#FFF9E3] hover:border-[#6C5CE7]";

              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-[#DFF9FB] border-2 border-[#55EFC4] text-[#2D3436] font-bold ring-2 ring-[#55EFC4]/30";
                } else if (isSelected) {
                  btnStyle = "bg-[#FFEDED] border-2 border-[#FF7675] text-[#2D3436] font-bold";
                } else {
                  btnStyle = "bg-white border-2 border-[#FFEAA7]/40 text-[#A0A0A0] opacity-50";
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasAnswered}
                  className={`p-4 rounded-2xl text-left text-xs md:text-sm font-semibold transition-all flex items-center justify-between gap-3 shadow-xs cursor-pointer ${btnStyle}`}
                  id={`quiz-opt-${optIdx}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-white border border-[#FFEAA7] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {hasAnswered && (
                    <div>
                      {isCorrect && <CheckCircle size={20} className="text-[#00B894] shrink-0" />}
                      {!isCorrect && isSelected && <XCircle size={20} className="text-[#FF7675] shrink-0" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Hint Button */}
          {currentQ.hint && !showExplanation[currentIdx] && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowHint({ ...showHint, [currentIdx]: !showHint[currentIdx] })}
                className="inline-flex items-center gap-1.5 text-xs text-[#6C5CE7] hover:underline font-bold"
              >
                <HelpCircle size={14} />
                <span>{showHint[currentIdx] ? "Hide Hint" : "Need a Hint?"}</span>
              </button>

              {showHint[currentIdx] && (
                <div className="mt-2 p-3 rounded-2xl bg-[#FFF9E3] border border-[#FFEAA7] text-xs text-[#2D3436] font-medium">
                  💡 <strong>Guru's Hint:</strong> {currentQ.hint}
                </div>
              )}
            </div>
          )}

          {/* Explanation Box */}
          {showExplanation[currentIdx] && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 rounded-3xl bg-[#FFF9E3] border-2 border-[#FFEAA7] shadow-xs"
            >
              <p className="text-xs font-black uppercase tracking-wider text-[#6C5CE7] mb-1 flex items-center gap-1.5">
                <Lightbulb size={15} />
                Guru Explanation:
              </p>
              <p className="text-xs md:text-sm text-[#2D3436] font-medium leading-relaxed">
                {currentQ.explanation}
              </p>
            </motion.div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-[#FFEAA7]">
            <div className="flex items-center gap-1">
              {quiz.map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 rounded-full transition-all ${
                    i === currentIdx
                      ? "w-8 bg-[#6C5CE7]"
                      : selectedAnswers[i] !== undefined
                      ? "w-2.5 bg-[#55EFC4]"
                      : "w-2.5 bg-[#FFEAA7]"
                  }`}
                />
              ))}
            </div>

            {selectedAnswers[currentIdx] !== undefined && (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#6C5CE7] hover:bg-[#5849C4] text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
                id="next-quiz-btn"
              >
                <span>{currentIdx < totalQuestions - 1 ? "Next Question" : "See Final Score"}</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className="text-center py-8 space-y-5" id="quiz-complete-card">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#FFF9E3] text-[#F1C40F] border-2 border-[#FFEAA7] flex items-center justify-center shadow-lg">
            <Trophy size={44} />
          </div>

          <div>
            <h4 className="text-2xl md:text-3xl font-black text-[#2D3436]">
              {score === totalQuestions ? "Flawless Mastery! 🎉" : "Great Job Learning! 🌟"}
            </h4>
            <p className="text-base text-[#636E72] mt-1">
              You scored <strong className="text-[#6C5CE7]">{score} out of {totalQuestions}</strong> correct.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetQuiz}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#6C5CE7] hover:bg-[#5849C4] text-white font-black text-sm shadow-lg transition-all active:scale-95 cursor-pointer"
            id="retry-quiz-btn"
          >
            <RotateCcw size={16} />
            <span>Retake Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
}
