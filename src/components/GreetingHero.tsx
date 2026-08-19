import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  GraduationCap,
  Atom,
  Cpu,
  Globe,
  Dna,
  Coins,
  Compass,
  BookOpen,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { GuruAvatar } from "./GuruAvatar";
import { speechService, createSpeechRecognizer } from "../services/speech";
import { GradeLevel } from "../types";

interface GreetingHeroProps {
  onSearchTopic: (topic: string, level: GradeLevel) => void;
  isLoading: boolean;
}

const POPULAR_STUDENT_TOPICS = [
  { label: "Photosynthesis 🌿", topic: "Photosynthesis", icon: Atom, level: "Middle School" as GradeLevel, color: "border-[#55EFC4] bg-[#DFF9FB]" },
  { label: "Black Holes 🌌", topic: "Black Holes and Event Horizons", icon: Globe, level: "Middle School" as GradeLevel, color: "border-[#74B9FF] bg-[#E8F4FD]" },
  { label: "Internet & Packets 🌐", topic: "How the Internet Works: Packets and Routers", icon: Globe, level: "Middle School" as GradeLevel, color: "border-[#6C5CE7]/30 bg-[#F3F0FF]" },
  { label: "Machine Learning 🤖", topic: "How Machine Learning Works", icon: Cpu, level: "High School" as GradeLevel, color: "border-[#FFEAA7] bg-[#FFF9E3]" },
  { label: "Inflation 📈", topic: "Economic Inflation and Purchasing Power", icon: Coins, level: "High School" as GradeLevel, color: "border-[#FAB1A0] bg-[#FFEDED]" },
  { label: "DNA & CRISPR 🧬", topic: "DNA Replication and CRISPR Gene Editing", icon: Dna, level: "High School" as GradeLevel, color: "border-[#55EFC4] bg-[#DFF9FB]" },
  { label: "Rocket Propulsion 🚀", topic: "Rocket Propulsion and Newton's Third Law", icon: Compass, level: "Middle School" as GradeLevel, color: "border-[#FF7675] bg-[#FFEDED]" },
];

export function GreetingHero({ onSearchTopic, isLoading }: GreetingHeroProps) {
  const [topicInput, setTopicInput] = useState("");
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>("Middle School");
  const [animationStage, setAnimationStage] = useState<"greeting" | "searchPopped">("greeting");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechMuted, setSpeechMuted] = useState(false);
  const [hasStartedVoice, setHasStartedVoice] = useState(false);

  const recognitionRef = useRef<{ start: () => void; stop: () => void; isSupported: boolean } | null>(null);

  // Subscribe to speech synthesis state
  useEffect(() => {
    const unsub = speechService.onSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });
    return unsub;
  }, []);

  // Play Guru's spoken welcome and trigger the popup animation
  const playGreetingSpeech = () => {
    setHasStartedVoice(true);
    const greetingText =
      "Hi there! I am Guru. I turn complex ideas into simple stories. What shall we learn today?";

    speechService.speak(greetingText, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  useEffect(() => {
    // Stage 1: Welcoming animation sequence
    const timer = setTimeout(() => {
      setAnimationStage("searchPopped");
    }, 1000);

    // Auto-trigger speech greeting
    const voiceTimer = setTimeout(() => {
      if (!hasStartedVoice) {
        playGreetingSpeech();
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      clearTimeout(voiceTimer);
      speechService.stop();
    };
  }, []);

  // Setup speech recognition
  useEffect(() => {
    recognitionRef.current = createSpeechRecognizer(
      (transcript) => {
        setTopicInput(transcript);
      },
      () => {
        setIsListening(false);
      }
    );
  }, []);

  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current?.isSupported) {
      setVoiceNotice("Voice input not supported on this browser. Type below!");
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      speechService.stop();
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim() || isLoading) return;
    speechService.stop();
    onSearchTopic(topicInput.trim(), gradeLevel);
  };

  const handleTopicChipClick = (topic: string, level: GradeLevel) => {
    if (isLoading) return;
    setTopicInput(topic);
    setGradeLevel(level);
    speechService.stop();
    onSearchTopic(topic, level);
  };

  const toggleMute = () => {
    const next = !speechMuted;
    setSpeechMuted(next);
    speechService.setMuted(next);
    if (next) {
      speechService.stop();
    } else {
      playGreetingSpeech();
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-between px-4 py-10 text-[#2D3436] bg-[#FFFAF0] overflow-hidden" id="guru-greeting-hero">
      {/* Decorative Pastel Background Shapes */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#FF7675]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#74B9FF]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#FFEAA7]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Body */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Guru Mascot + Welcoming Speech Bubble from Design HTML */}
        <div className="relative mb-10 flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Guru Character Box */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="cursor-pointer group relative"
            onClick={playGreetingSpeech}
            title="Click to hear Guru speak again"
            id="hero-guru-avatar-btn"
          >
            <GuruAvatar isSpeaking={isSpeaking} size="xl" mood="welcoming" showPointer={true} />
            <motion.div
              animate={{ rotate: [6, -6, 6] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -top-3 -right-3 bg-[#FFEAA7] text-[#2D3436] text-xs font-black px-3 py-1 rounded-full shadow-md border-2 border-white flex items-center gap-1"
            >
              <Sparkles size={13} className="text-[#FF7675]" />
              <span>Hi Friend!</span>
            </motion.div>
          </motion.div>

          {/* Welcoming Speech Card from Design Specification */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="bg-white p-6 rounded-3xl shadow-xl border-2 border-[#FAB1A0] max-w-sm text-left relative"
            id="guru-speech-bubble"
          >
            {/* Left triangle pointer */}
            <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-l-2 border-b-2 border-[#FAB1A0] transform rotate-45" />

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#55EFC4] animate-ping" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6C5CE7]">
                  Guru Voice
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={playGreetingSpeech}
                  className="p-1 rounded-lg text-[#636E72] hover:text-[#6C5CE7] hover:bg-[#FFF9E3] transition-colors"
                  title="Replay Voice"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1 rounded-lg text-[#636E72] hover:text-[#FF7675] hover:bg-[#FFEDED] transition-colors"
                  title={speechMuted ? "Unmute" : "Mute"}
                >
                  {speechMuted ? <VolumeX size={14} className="text-[#FF7675]" /> : <Volume2 size={14} className="text-[#22A6B3]" />}
                </button>
              </div>
            </div>

            <p className="text-lg font-medium leading-relaxed italic text-[#2D3436]">
              &ldquo;Hi there! I am <span className="font-bold text-[#6C5CE7] not-italic">Guru</span>. I turn complex ideas into simple stories. What shall we learn today?&rdquo;
            </p>
          </motion.div>
        </div>

        {/* Search Bar - Pops up dynamically after welcoming animation (Design HTML Spec) */}
        <AnimatePresence>
          {animationStage === "searchPopped" && (
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.35 }}
              className="w-full max-w-3xl"
              id="guru-search-container"
            >
              <form onSubmit={handleFormSubmit} className="relative group">
                <div className="w-full bg-white rounded-[2.5rem] shadow-xl border-4 border-[#FFEAA7] p-2 md:p-3 flex items-center gap-3 md:gap-4 focus-within:border-[#6C5CE7] transition-all">
                  <div className="pl-4 text-[#A0A0A0]">
                    <Search size={26} strokeWidth={2.5} className="text-[#6C5CE7]" />
                  </div>

                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="Explain quantum physics using a pizza analogy..."
                    className="flex-1 py-3 md:py-4 text-base md:text-xl outline-none font-medium text-[#2D3436] placeholder-[#A0A0A0] bg-transparent"
                    autoFocus
                    disabled={isLoading}
                    id="topic-search-input"
                  />

                  {/* Voice input button */}
                  {recognitionRef.current?.isSupported && (
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={`p-3 rounded-full transition-all ${
                        isListening
                          ? "bg-[#FF7675] text-white animate-pulse"
                          : "text-[#636E72] hover:text-[#6C5CE7] hover:bg-[#FFF9E3]"
                      }`}
                      title={isListening ? "Listening... click to stop" : "Speak topic"}
                      id="voice-mic-search-btn"
                    >
                      {isListening ? <Mic size={22} /> : <MicOff size={22} />}
                    </button>
                  )}

                  {/* Big Purple Vibrant Button */}
                  <button
                    type="submit"
                    disabled={!topicInput.trim() || isLoading}
                    className="bg-[#6C5CE7] text-white px-8 md:px-10 py-3.5 md:py-4 rounded-[2rem] font-black text-base md:text-lg hover:bg-[#5849C4] transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    id="teach-me-btn"
                  >
                    {isLoading ? "Cooking..." : "GO!"}
                  </button>
                </div>
              </form>

              {/* Grade Level Selector */}
              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs font-semibold text-[#636E72]" id="grade-level-selector">
                <span className="flex items-center gap-1 text-[#2D3436] font-bold mr-1">
                  <GraduationCap size={15} className="text-[#6C5CE7]" />
                  Learning Depth:
                </span>
                {(["Elementary (Like I'm 10)", "Middle School", "High School", "College / Advanced"] as GradeLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setGradeLevel(lvl)}
                    className={`px-3.5 py-1.5 rounded-full transition-all font-bold ${
                      gradeLevel === lvl
                        ? "bg-[#6C5CE7] text-white shadow-xs"
                        : "bg-white text-[#636E72] hover:text-[#2D3436] border-2 border-[#FFEAA7] hover:border-[#6C5CE7]"
                    }`}
                    id={`grade-${lvl.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Quick Suggestion Topic Badges */}
              <div className="mt-8 text-center" id="topic-suggestions-container">
                <p className="text-xs font-black uppercase tracking-wider text-[#A0A0A0] mb-3">
                  💡 Popular Topics to Explore:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {POPULAR_STUDENT_TOPICS.map((item) => (
                    <button
                      key={item.topic}
                      type="button"
                      onClick={() => handleTopicChipClick(item.topic, item.level)}
                      disabled={isLoading}
                      className={`group flex items-center gap-2 px-4 py-2 rounded-full border-2 ${item.color} text-[#2D3436] text-xs md:text-sm font-bold transition-all hover:scale-105 shadow-xs cursor-pointer`}
                      id={`topic-chip-${item.topic.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                    >
                      <item.icon size={15} className="text-[#6C5CE7] group-hover:rotate-12 transition-transform" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Core Vibrant Cards from Design HTML */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 w-full text-left">
                {/* Card 1: Simple Analogies */}
                <div className="bg-[#DFF9FB] p-6 rounded-3xl border-2 border-[#C7ECEE] transform md:-rotate-1 shadow-sm hover:rotate-0 transition-transform">
                  <div className="w-11 h-11 bg-[#22A6B3] rounded-2xl mb-4 flex items-center justify-center text-white shadow-xs">
                    <BookOpen size={22} />
                  </div>
                  <h3 className="font-bold text-lg text-[#2D3436] mb-1">Simple Analogies</h3>
                  <p className="text-xs md:text-sm text-[#636E72] leading-relaxed">
                    Complex concepts translated into familiar everyday objects and stories.
                  </p>
                </div>

                {/* Card 2: Step-by-Step */}
                <div className="bg-[#FFF9E3] p-6 rounded-3xl border-2 border-[#FFEAA7] shadow-sm hover:scale-[1.02] transition-transform">
                  <div className="w-11 h-11 bg-[#F1C40F] rounded-2xl mb-4 flex items-center justify-center text-white shadow-xs">
                    <CheckCircle2 size={22} />
                  </div>
                  <h3 className="font-bold text-lg text-[#2D3436] mb-1">Step-by-Step</h3>
                  <p className="text-xs md:text-sm text-[#636E72] leading-relaxed">
                    Breaking down challenging topics into bite-sized, intuitive checkpoints.
                  </p>
                </div>

                {/* Card 3: Visual Learning */}
                <div className="bg-[#FFEDED] p-6 rounded-3xl border-2 border-[#FFD3D3] transform md:rotate-1 shadow-sm hover:rotate-0 transition-transform">
                  <div className="w-11 h-11 bg-[#EB4D4B] rounded-2xl mb-4 flex items-center justify-center text-white shadow-xs">
                    <ImageIcon size={22} />
                  </div>
                  <h3 className="font-bold text-lg text-[#2D3436] mb-1">Visual Learning</h3>
                  <p className="text-xs md:text-sm text-[#636E72] leading-relaxed">
                    Interactive chalkboard sketches and visual diagrams as Guru narrates.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Status Bar from Design Spec */}
      <div className="w-full flex justify-center py-6">
        <div className="flex items-center gap-2 text-[#A0A0A0] text-sm font-semibold">
          <span className="w-2.5 h-2.5 bg-[#55EFC4] rounded-full animate-pulse"></span>
          <span>Guru is listening and ready to help</span>
        </div>
      </div>
    </section>
  );
}
