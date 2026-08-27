import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Layers,
  BookOpen,
  HelpCircle,
  Trophy,
  FileText,
  Lightbulb,
  ArrowLeft,
  GraduationCap,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { GreetingHero } from "./components/GreetingHero";
import { WhiteboardCanvas } from "./components/WhiteboardCanvas";
import { AnalogyCard } from "./components/AnalogyCard";
import { StepExplainer } from "./components/StepExplainer";
import { QuizSection } from "./components/QuizSection";
import { SummaryCheatSheet } from "./components/SummaryCheatSheet";
import { GuruChatDrawer } from "./components/GuruChatDrawer";
import { GuruAvatar } from "./components/GuruAvatar";
import { speechService } from "./services/speech";
import { fetchTopicExplanation } from "./services/api";
import { TopicExplanation, GradeLevel } from "./types";

export default function App() {
  const [activeView, setActiveView] = useState<"greeting" | "lesson">("greeting");
  const [currentLesson, setCurrentLesson] = useState<TopicExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>("Middle School");
  const [activeTab, setActiveTab] = useState<"interactive" | "analogy" | "quiz" | "summary">("interactive");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSearchedTopic, setLastSearchedTopic] = useState<{ topic: string; level: GradeLevel } | null>(null);
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("guru_history");
      return saved ? JSON.parse(saved) : ["Photosynthesis", "Black Holes", "Neural Networks"];
    } catch {
      return ["Photosynthesis", "Black Holes"];
    }
  });

  // Track speech state
  useEffect(() => {
    const unsub = speechService.onSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });
    return unsub;
  }, []);

  const handleSearchTopic = async (topic: string, level: GradeLevel) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setLastSearchedTopic({ topic, level });
      speechService.stop();

      // Update history
      const updated = [topic, ...history.filter((h) => h.toLowerCase() !== topic.toLowerCase())].slice(0, 8);
      setHistory(updated);
      try {
        localStorage.setItem("guru_history", JSON.stringify(updated));
      } catch {}

      const lessonData = await fetchTopicExplanation(topic, level);
      setCurrentLesson(lessonData);
      setCurrentStepIndex(0);
      setActiveTab("interactive");
      setActiveView("lesson");

      // Play introductory lesson greeting from Guru (safe from audio policies)
      try {
        const welcomeScript =
          lessonData.speechScripts?.welcome ||
          `Welcome! Guru is ready to explore ${lessonData.title} with you. Let's start with the central analogy!`;
        speechService.speak(welcomeScript);
      } catch (speechErr) {
        console.warn("Speech synthesis non-fatal:", speechErr);
      }
    } catch (err: any) {
      console.error("Lesson loading error:", err);
      setErrorMessage("Guru had trouble preparing this lesson. Please try again or explore another topic!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadCurrentStep = () => {
    if (!currentLesson) return;
    const step = currentLesson.steps[currentStepIndex];
    const script =
      currentLesson.speechScripts?.steps?.[currentStepIndex] ||
      `Step ${currentStepIndex + 1}: ${step.title}. ${step.content}. Real world example: ${step.example}. Key takeaway: ${step.keyTakeaway}`;

    speechService.speak(script);
  };

  const handleReadSummary = () => {
    if (!currentLesson) return;
    const script =
      currentLesson.speechScripts?.wrapup ||
      `Here are the core summary takeaways for ${currentLesson.topic}: ${currentLesson.whiteboardSummary.goldenRule}`;

    speechService.speak(script);
  };

  const handleStepChange = (newIndex: number) => {
    setCurrentStepIndex(newIndex);
    speechService.stop();
    // Speak the new step automatically (only if not muted)
    if (currentLesson && !speechService.muted) {
      const step = currentLesson.steps[newIndex];
      const script =
        currentLesson.speechScripts?.steps?.[newIndex] ||
        `Step ${newIndex + 1}: ${step.title}. ${step.content}`;
      speechService.speak(script);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0] text-[#2D3436] flex flex-col selection:bg-[#FFEAA7] selection:text-[#2D3436] font-sans antialiased" id="guru-app-root">
      {/* Top Navigation */}
      <Navbar
        currentTopic={currentLesson ? currentLesson.topic : null}
        onSearchNewTopic={handleSearchTopic}
        onHomeClick={() => {
          speechService.stop();
          setActiveView("greeting");
        }}
        isSpeaking={isSpeaking}
        gradeLevel={gradeLevel}
        onGradeLevelChange={(lvl) => {
          setGradeLevel(lvl);
          if (currentLesson) {
            handleSearchTopic(currentLesson.topic, lvl);
          }
        }}
        history={history}
      />

      {/* Error Toast Notification Banner */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-white border-2 border-[#FF7675] shadow-xl rounded-3xl p-4 flex items-center justify-between gap-3 text-sm text-[#2D3436]"
            id="guru-error-banner"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFEAA7] border border-[#FDCB6E] flex items-center justify-center shrink-0 text-lg">
                🦉
              </div>
              <div>
                <p className="font-bold text-[#2D3436] text-xs md:text-sm">{errorMessage}</p>
                {lastSearchedTopic && (
                  <button
                    type="button"
                    onClick={() => {
                      if (lastSearchedTopic) {
                        handleSearchTopic(lastSearchedTopic.topic, lastSearchedTopic.level);
                      }
                    }}
                    className="text-xs font-black text-[#6C5CE7] hover:underline mt-0.5 cursor-pointer"
                  >
                    Try again ↺
                  </button>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="p-1.5 rounded-full hover:bg-gray-100 text-[#636E72] hover:text-[#2D3436] transition-colors cursor-pointer"
              title="Dismiss"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main View Router */}
      <main className="flex-1 w-full relative">
        {/* Loading Overlay when generating lesson */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#FFFAF0]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
              id="guru-loading-screen"
            >
              <div className="relative mb-8">
                <GuruAvatar isSpeaking={true} size="xl" mood="thinking" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 rounded-full border-4 border-dashed border-[#6C5CE7]/40 pointer-events-none"
                />
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-[#2D3436] mb-2">
                Guru is Preparing Your Lesson...
              </h2>
              <p className="text-sm md:text-base text-[#636E72] font-medium max-w-md mb-6">
                Crafting visual analogies, drawing chalkboard diagrams, and structuring step-by-step examples.
              </p>

              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-[#FFEAA7] text-[#6C5CE7] text-xs font-black shadow-xs">
                <Sparkles size={16} className="animate-spin text-[#F1C40F]" />
                <span>Zero-Cost Vibrant Learning Experience</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeView === "greeting" ? (
          /* Greeting Page with Guru Voice & Search */
          <GreetingHero onSearchTopic={handleSearchTopic} isLoading={isLoading} />
        ) : (
          /* Active Lesson Studio View */
          currentLesson && (
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8" id="lesson-studio-container">
              {/* Back to Topics Button & Hero Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-[#FFEAA7]">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      speechService.stop();
                      setActiveView("greeting");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-[#636E72] hover:text-[#6C5CE7] transition-colors mb-3 font-bold cursor-pointer"
                    id="back-to-greeting-btn"
                  >
                    <ArrowLeft size={15} />
                    <span>← Back to Topic Search</span>
                  </button>

                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs uppercase font-black tracking-wider px-3 py-1 rounded-full bg-[#DFF9FB] text-[#22A6B3] border border-[#C7ECEE] shadow-xs">
                      {currentLesson.subject || "Science"}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFF9E3] text-[#2D3436] border border-[#FFEAA7] shadow-xs">
                      {gradeLevel}
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-[#636E72] border border-[#FFEAA7] shadow-xs">
                      {currentLesson.difficulty || "Intuitive"}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-black text-[#2D3436] tracking-tight">
                    {currentLesson.title}
                  </h1>
                  <p className="text-base md:text-lg text-[#636E72] font-medium mt-1">
                    {currentLesson.tagline}
                  </p>
                </div>

                {/* Lesson Voice Control Bar */}
                <div className="flex items-center gap-3 bg-white border-2 border-[#FFEAA7] p-3.5 rounded-3xl shrink-0 shadow-sm">
                  <GuruAvatar isSpeaking={isSpeaking} size="sm" />
                  <div>
                    <span className="text-xs font-black text-[#2D3436] block">Guru Narration</span>
                    <span className="text-[11px] font-semibold text-[#636E72]">
                      {isSpeaking ? "Speaking now..." : "Click to listen"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (isSpeaking) {
                        speechService.stop();
                      } else {
                        handleReadCurrentStep();
                      }
                    }}
                    className="p-3 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849C4] text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    title={isSpeaking ? "Pause Voice" : "Play Step Voice"}
                    id="guru-voice-play-pause-btn"
                  >
                    {isSpeaking ? <VolumeX size={18} /> : <Play size={18} />}
                  </button>
                </div>
              </div>

              {/* Lesson Section Navigation Tabs */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b-2 border-[#FFEAA7] text-sm font-bold" id="lesson-tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab("interactive")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "interactive"
                      ? "bg-[#6C5CE7] text-white shadow-md font-black"
                      : "bg-white text-[#636E72] hover:text-[#2D3436] border-2 border-[#FFEAA7] hover:border-[#6C5CE7]"
                  }`}
                  id="tab-interactive-btn"
                >
                  <Layers size={16} />
                  <span>Interactive Whiteboard & Steps</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("analogy")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "analogy"
                      ? "bg-[#6C5CE7] text-white shadow-md font-black"
                      : "bg-white text-[#636E72] hover:text-[#2D3436] border-2 border-[#FFEAA7] hover:border-[#6C5CE7]"
                  }`}
                  id="tab-analogy-btn"
                >
                  <Lightbulb size={16} />
                  <span>The Core Analogy Story</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("quiz")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "quiz"
                      ? "bg-[#6C5CE7] text-white shadow-md font-black"
                      : "bg-white text-[#636E72] hover:text-[#2D3436] border-2 border-[#FFEAA7] hover:border-[#6C5CE7]"
                  }`}
                  id="tab-quiz-btn"
                >
                  <Trophy size={16} />
                  <span>Quiz ({currentLesson.quiz.length} Qs)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("summary")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "summary"
                      ? "bg-[#6C5CE7] text-white shadow-md font-black"
                      : "bg-white text-[#636E72] hover:text-[#2D3436] border-2 border-[#FFEAA7] hover:border-[#6C5CE7]"
                  }`}
                  id="tab-summary-btn"
                >
                  <FileText size={16} />
                  <span>Chalkboard Summary</span>
                </button>
              </div>

              {/* Main Content Area based on Selected Tab */}
              <div>
                {activeTab === "interactive" && (
                  <div className="space-y-8">
                    {/* Split View: Whiteboard Canvas on Left/Top, Step Explainer on Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                      <div className="lg:col-span-7 flex flex-col">
                        <WhiteboardCanvas
                          drawData={currentLesson.steps[currentStepIndex].whiteboardDraw}
                          isGuruSpeaking={isSpeaking}
                          stepNumber={currentStepIndex + 1}
                        />
                      </div>

                      <div className="lg:col-span-5 flex flex-col">
                        <StepExplainer
                          steps={currentLesson.steps}
                          currentStepIndex={currentStepIndex}
                          onStepChange={handleStepChange}
                          isSpeaking={isSpeaking}
                          onReadStep={handleReadCurrentStep}
                          speechScripts={currentLesson.speechScripts?.steps}
                        />
                      </div>
                    </div>

                    {/* Quick Analogy preview banner */}
                    <div className="p-6 rounded-[2rem] bg-white border-4 border-[#FFEAA7] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#FFF9E3] text-[#F1C40F] border border-[#FFEAA7] flex items-center justify-center shrink-0">
                          <Lightbulb size={24} />
                        </div>
                        <div>
                          <p className="text-xs uppercase font-black tracking-wider text-[#6C5CE7]">
                            Central Metaphor
                          </p>
                          <p className="text-base font-bold text-[#2D3436]">
                            {currentLesson.analogy.title} — {currentLesson.analogy.metaphor}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab("analogy")}
                        className="px-5 py-2.5 rounded-full bg-[#FFF9E3] hover:bg-[#FFEAA7] text-xs font-black text-[#2D3436] transition-all shrink-0 cursor-pointer"
                      >
                        Explore Full Analogy Story →
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "analogy" && (
                  <AnalogyCard
                    lesson={currentLesson}
                    isSpeaking={isSpeaking}
                    onStartSpeech={(text) => speechService.speak(text)}
                  />
                )}

                {activeTab === "quiz" && (
                  <QuizSection quiz={currentLesson.quiz} topic={currentLesson.topic} />
                )}

                {activeTab === "summary" && (
                  <SummaryCheatSheet
                    summary={currentLesson.whiteboardSummary}
                    topic={currentLesson.topic}
                    onReadSummary={handleReadSummary}
                  />
                )}
              </div>

              {/* Floating Guru Chat Drawer for Instant Student Q&A */}
              <GuruChatDrawer
                lesson={currentLesson}
                currentStepIndex={currentStepIndex}
              />
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t-2 border-[#FFEAA7] bg-[#FFFAF0] py-8 text-center text-xs text-[#636E72] font-semibold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Guru AI Tutor — Vibrant Visual Learning for Curious Students.</p>
          <div className="flex items-center gap-4 text-[#636E72]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#55EFC4]" />
              Zero-Cost
            </span>
            <span>•</span>
            <span>Web Speech Narration</span>
            <span>•</span>
            <span>Gemini Pedagogical Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
