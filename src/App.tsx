import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Trophy,
  FileText,
  Lightbulb,
  ArrowLeft,
  Play,
  Pause,
  Clock,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { GreetingHero } from "./components/GreetingHero";
import { YouTubeVideoPlayer } from "./components/YouTubeVideoPlayer";
import { VideoTranscript } from "./components/VideoTranscript";
import { QuizSection } from "./components/QuizSection";
import { GuruChatDrawer } from "./components/GuruChatDrawer";
import { GuruAvatar } from "./components/GuruAvatar";
import { speechService } from "./services/speech";
import { fetchTopicExplanation } from "./services/api";
import { formatTime, ensureVideoContent } from "./services/videoHelper";
import { TopicExplanation, GradeLevel } from "./types";

export default function App() {
  const [activeView, setActiveView] = useState<"greeting" | "lesson">("greeting");
  const [currentLesson, setCurrentLesson] = useState<TopicExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>("Middle School");
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"transcript" | "quiz" | "chat">("transcript");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
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
      setGradeLevel(level);
      speechService.stop();
      setIsPlaying(false);
      setCurrentTime(0);

      // Update search history
      const updated = [topic, ...history.filter((h) => h.toLowerCase() !== topic.toLowerCase())].slice(0, 8);
      setHistory(updated);
      try {
        localStorage.setItem("guru_history", JSON.stringify(updated));
      } catch {}

      const lessonData = await fetchTopicExplanation(topic, level);
      if (!lessonData.video) {
        lessonData.video = ensureVideoContent(lessonData);
      }
      setCurrentLesson(lessonData);
      setActiveView("lesson");
      setSidebarTab("transcript");
      setCurrentTime(0);
      setIsPlaying(true);
    } catch (err: any) {
      console.error("Lesson loading error:", err);
      setErrorMessage("Guru had trouble preparing this video lesson. Please try again or explore another topic!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0] text-[#2D3436] flex flex-col selection:bg-[#FFEAA7] selection:text-[#2D3436] font-sans antialiased" id="guru-app-root">
      {/* Top Navigation */}
      <Navbar
        currentTopic={currentLesson ? currentLesson.topic : null}
        onSearchNewTopic={handleSearchTopic}
        onHomeClick={() => {
          speechService.stop();
          setIsPlaying(false);
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

      {/* Main Content Router */}
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
                Generating Video & Transcript...
              </h2>
              <p className="text-sm md:text-base text-[#636E72] font-medium max-w-md mb-6">
                Directing animated scenes, syncing timecodes, and calibrating narration for {gradeLevel} level.
              </p>

              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border-2 border-[#FFEAA7] text-[#6C5CE7] text-xs font-black shadow-xs">
                <Sparkles size={16} className="animate-spin text-[#F1C40F]" />
                <span>AI Video Pedagogical Engine</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeView === "greeting" ? (
          /* Greeting Page with Guru Voice & Search */
          <GreetingHero
            onSearchTopic={handleSearchTopic}
            isLoading={isLoading}
            initialGradeLevel={gradeLevel}
            onGradeLevelChange={setGradeLevel}
          />
        ) : (
          /* YouTube Watch Page View */
          currentLesson && (
            <div className="max-w-7xl mx-auto px-4 py-6" id="youtube-watch-page">
              {/* Back to Topics Navigation Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#FFEAA7]/80 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    speechService.stop();
                    setIsPlaying(false);
                    setActiveView("greeting");
                  }}
                  className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-[#636E72] hover:text-[#6C5CE7] transition-colors cursor-pointer"
                  id="back-to-greeting-btn"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Search</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-black tracking-wider px-3 py-1 rounded-full bg-[#DFF9FB] text-[#22A6B3] border border-[#C7ECEE]">
                    {currentLesson.subject || "Science"}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFF9E3] text-[#2D3436] border border-[#FFEAA7]">
                    {gradeLevel} Level
                  </span>
                </div>
              </div>

              {/* Main 2-Column YouTube Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Player, Video Info, Description */}
                <div className="lg:col-span-8 flex flex-col space-y-4">
                  {/* YouTube Video Player Component */}
                  <YouTubeVideoPlayer
                    video={currentLesson.video}
                    topic={currentLesson.topic}
                    title={currentLesson.title}
                    level={gradeLevel}
                    currentTime={currentTime}
                    isPlaying={isPlaying}
                    onTimeUpdate={setCurrentTime}
                    onPlayStateChange={setIsPlaying}
                    onSeek={handleSeek}
                  />

                  {/* Video Title and Tagline */}
                  <div className="pt-2">
                    <h1 className="text-2xl md:text-3xl font-black text-[#2D3436] tracking-tight leading-snug">
                      {currentLesson.title}
                    </h1>
                    <p className="text-sm md:text-base font-semibold text-[#636E72] mt-1">
                      {currentLesson.tagline}
                    </p>
                  </div>

                  {/* Channel / Author Row & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-[#FFEAA7]">
                    <div className="flex items-center gap-3">
                      <GuruAvatar isSpeaking={isPlaying && !speechService.muted} size="md" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm md:text-base text-[#2D3436]">
                            Guru AI Tutor
                          </span>
                          <span className="w-4 h-4 rounded-full bg-[#55EFC4] text-[#00B894] inline-flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        </div>
                        <p className="text-xs text-[#636E72] font-medium">
                          Personalized for {gradeLevel}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Play/Pause Button */}
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                          isPlaying
                            ? "bg-[#FFEAA7] text-[#2D3436] hover:bg-[#FDCB6E]"
                            : "bg-[#FF0000] text-white hover:bg-[#D63031]"
                        }`}
                        id="action-play-pause-btn"
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-white" />}
                        <span>{isPlaying ? "Pause" : "Play Video"}</span>
                      </button>

                      {/* Quiz Button */}
                      <button
                        type="button"
                        onClick={() => setSidebarTab("quiz")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#FFF9E3] border border-[#FFEAA7] text-xs font-bold text-[#2D3436] transition-colors cursor-pointer"
                        id="action-quiz-btn"
                      >
                        <Trophy size={14} className="text-[#F1C40F]" />
                        <span>Quiz ({currentLesson.quiz.length})</span>
                      </button>

                      {/* Share Button */}
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#FFF9E3] border border-[#FFEAA7] text-xs font-bold text-[#636E72] hover:text-[#2D3436] transition-colors cursor-pointer"
                        id="action-share-btn"
                      >
                        {copiedLink ? <Check size={14} className="text-[#00B894]" /> : <Share2 size={14} />}
                        <span>{copiedLink ? "Copied!" : "Share"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Expandable YouTube-style Description Box */}
                  <div
                    className="p-5 rounded-3xl bg-white border-2 border-[#FFEAA7] shadow-sm space-y-4 text-xs md:text-sm text-[#2D3436]"
                    id="video-description-box"
                  >
                    <div className="flex items-center justify-between font-bold text-xs text-[#636E72]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{formatTime(currentLesson.video.totalDuration)} duration</span>
                        <span>•</span>
                        <span>{currentLesson.video.scenes.length} Chapters</span>
                        <span>•</span>
                        <span>Interactive Transcript Available</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="inline-flex items-center gap-1 text-[#6C5CE7] hover:underline cursor-pointer font-black"
                      >
                        <span>{isDescriptionExpanded ? "Show less" : "Show more"}</span>
                        {isDescriptionExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>

                    {/* Central Mental Model / Analogy */}
                    <div className="p-3.5 rounded-2xl bg-[#FFFAF0] border border-[#FFEAA7] flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#FFF9E3] text-[#F1C40F] border border-[#FFEAA7] flex items-center justify-center shrink-0 mt-0.5">
                        <Lightbulb size={18} />
                      </div>
                      <div>
                        <h4 className="font-black text-xs uppercase tracking-wider text-[#6C5CE7]">
                          Everyday Analogy: {currentLesson.analogy.title}
                        </h4>
                        <p className="text-xs md:text-sm text-[#2D3436] font-medium mt-0.5 leading-relaxed">
                          {currentLesson.analogy.story}
                        </p>
                      </div>
                    </div>

                    {/* Collapsible Chapters & Takeaway Details */}
                    {isDescriptionExpanded && (
                      <div className="space-y-4 pt-2 border-t border-[#FFEAA7]/60">
                        {/* Clickable Video Chapters */}
                        <div>
                          <h4 className="font-black text-xs uppercase tracking-wider text-[#636E72] mb-2 flex items-center gap-1.5">
                            <Clock size={14} />
                            <span>Chapters & Timestamps (Click to Jump)</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {currentLesson.video.scenes.map((scene) => {
                              const isCurrentScene =
                                currentTime >= scene.startTime && currentTime < scene.endTime;
                              return (
                                <button
                                  key={scene.id}
                                  type="button"
                                  onClick={() => {
                                    handleSeek(scene.startTime);
                                    setIsPlaying(true);
                                  }}
                                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                                    isCurrentScene
                                      ? "bg-[#6C5CE7]/10 border-[#6C5CE7] font-bold"
                                      : "bg-[#FFFAF0] hover:bg-[#FFEAA7]/40 border-[#FFEAA7] font-medium"
                                  }`}
                                >
                                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-[#FFEAA7] text-[#6C5CE7] font-black shrink-0">
                                    {formatTime(scene.startTime)}
                                  </span>
                                  <span className="text-xs truncate text-[#2D3436]">
                                    {scene.chapterTitle}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Golden Rule / Key Takeaway */}
                        {currentLesson.whiteboardSummary?.goldenRule && (
                          <div className="p-3.5 rounded-2xl bg-[#E8F8F5] border border-[#A3E4D7]">
                            <h5 className="font-black text-xs uppercase tracking-wide text-[#16A085]">
                              Key Takeaway
                            </h5>
                            <p className="text-xs md:text-sm font-bold text-[#2D3436] mt-0.5">
                              {currentLesson.whiteboardSummary.goldenRule}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Sidebar (Transcript / Quiz / Q&A) */}
                <div className="lg:col-span-4 flex flex-col space-y-4">
                  {/* Tab Selector Buttons */}
                  <div className="flex items-center gap-2 p-1.5 bg-white border-2 border-[#FFEAA7] rounded-2xl shadow-xs">
                    <button
                      type="button"
                      onClick={() => setSidebarTab("transcript")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        sidebarTab === "transcript"
                          ? "bg-[#6C5CE7] text-white shadow-xs font-black"
                          : "text-[#636E72] hover:text-[#2D3436]"
                      }`}
                      id="tab-transcript-btn"
                    >
                      <FileText size={14} />
                      <span>Transcript</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSidebarTab("quiz")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        sidebarTab === "quiz"
                          ? "bg-[#6C5CE7] text-white shadow-xs font-black"
                          : "text-[#636E72] hover:text-[#2D3436]"
                      }`}
                      id="tab-quiz-btn"
                    >
                      <Trophy size={14} />
                      <span>Quiz</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSidebarTab("chat")}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        sidebarTab === "chat"
                          ? "bg-[#6C5CE7] text-white shadow-xs font-black"
                          : "text-[#636E72] hover:text-[#2D3436]"
                      }`}
                      id="tab-chat-btn"
                    >
                      <MessageSquare size={14} />
                      <span>Ask Q&A</span>
                    </button>
                  </div>

                  {/* Sidebar Panels */}
                  <div>
                    {sidebarTab === "transcript" && (
                      <VideoTranscript
                        transcript={currentLesson.video.transcript}
                        currentTime={currentTime}
                        onSeek={handleSeek}
                      />
                    )}

                    {sidebarTab === "quiz" && (
                      <div className="bg-white rounded-3xl border-2 border-[#FFEAA7] shadow-xl p-4 overflow-hidden">
                        <QuizSection quiz={currentLesson.quiz} topic={currentLesson.topic} />
                      </div>
                    )}

                    {sidebarTab === "chat" && (
                      <div className="bg-white rounded-3xl border-2 border-[#FFEAA7] shadow-xl p-5 flex flex-col space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-[#FFFAF0] rounded-2xl border border-[#FFEAA7]">
                          <GuruAvatar isSpeaking={false} size="sm" />
                          <div>
                            <h4 className="font-black text-xs text-[#2D3436]">Have a question?</h4>
                            <p className="text-[11px] text-[#636E72]">
                              Ask Guru anything about {currentLesson.title}!
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-[#636E72] leading-relaxed">
                          Click below to open the dedicated Guru AI chat drawer with voice recognition and smart pedagogical answers.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const trigger = document.getElementById("guru-chat-toggle-btn");
                            if (trigger) trigger.click();
                          }}
                          className="w-full py-3 px-4 rounded-2xl bg-[#6C5CE7] hover:bg-[#5849C4] text-white text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <MessageSquare size={16} />
                          <span>Open Guru AI Tutor Chat</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Guru Chat Drawer for Instant Student Q&A */}
              <GuruChatDrawer
                lesson={currentLesson}
                currentStepIndex={0}
              />
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t-2 border-[#FFEAA7] bg-[#FFFAF0] py-8 text-center text-xs text-[#636E72] font-semibold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Guru AI Tutor — Interactive Video Learning with Real-Time Synchronized Transcript.</p>
          <div className="flex items-center gap-4 text-[#636E72]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#55EFC4]" />
              Zero-Cost
            </span>
            <span>•</span>
            <span>YouTube-Style Synchronized Player</span>
            <span>•</span>
            <span>Gemini Pedagogical Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

