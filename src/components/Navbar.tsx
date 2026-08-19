import { useState, FormEvent } from "react";
import {
  Search,
  Volume2,
  VolumeX,
  Gauge,
  History,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { GuruAvatar } from "./GuruAvatar";
import { speechService } from "../services/speech";
import { GradeLevel } from "../types";

interface NavbarProps {
  currentTopic: string | null;
  onSearchNewTopic: (topic: string, level: GradeLevel) => void;
  onHomeClick: () => void;
  isSpeaking: boolean;
  gradeLevel: GradeLevel;
  onGradeLevelChange: (level: GradeLevel) => void;
  history: string[];
}

export function Navbar({
  currentTopic,
  onSearchNewTopic,
  onHomeClick,
  isSpeaking,
  gradeLevel,
  onGradeLevelChange,
  history,
}: NavbarProps) {
  const [searchInput, setSearchInput] = useState("");
  const [isMuted, setIsMuted] = useState(speechService.getIsMuted());
  const [speed, setSpeed] = useState(speechService.getRate());
  const [showHistory, setShowHistory] = useState(false);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    speechService.setMuted(next);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    speechService.setRate(newSpeed);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchNewTopic(searchInput.trim(), gradeLevel);
      setSearchInput("");
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FFFAF0]/95 backdrop-blur-md border-b-2 border-[#FFEAA7] text-[#2D3436] px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo from Vibrant Palette */}
        <div
          onClick={onHomeClick}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          id="navbar-logo-btn"
        >
          <div className="w-11 h-11 bg-[#6C5CE7] rounded-2xl flex items-center justify-center shadow-md transform rotate-6 group-hover:rotate-0 transition-transform">
            <span className="text-white font-black text-xl">G</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-[#2D3436]">
                Guru AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#55EFC4] text-[#2D3436] border border-white shadow-xs">
                Free Tutor
              </span>
            </div>
            <p className="text-[11px] text-[#636E72] font-medium hidden sm:block">
              Visual Student Learning
            </p>
          </div>
        </div>

        {/* Quick Search in Navbar (active when exploring a topic) */}
        {currentTopic && (
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md hidden md:flex items-center relative"
          >
            <Search size={16} className="absolute left-3.5 text-[#A0A0A0]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search another concept..."
              className="w-full bg-white border-2 border-[#FFEAA7] focus:border-[#6C5CE7] rounded-full pl-10 pr-4 py-2 text-xs font-medium text-[#2D3436] placeholder-[#A0A0A0] focus:outline-none transition-all shadow-xs"
            />
          </form>
        )}

        {/* Right Tools & Voice Controls */}
        <div className="flex items-center gap-2.5">
          {/* Curiosity Level Tag */}
          <div className="hidden lg:flex items-center px-3.5 py-1.5 bg-white rounded-full border-2 border-[#FFEAA7] text-xs font-bold text-[#2D3436] shadow-xs">
            Curiosity: <span className="text-[#6C5CE7] ml-1">High</span>
          </div>

          {/* Grade Level Selector */}
          <div className="hidden md:flex items-center bg-white border-2 border-[#FFEAA7] rounded-full p-1 text-[11px] font-semibold shadow-xs">
            {(["Elementary (Like I'm 10)", "Middle School", "High School", "College / Advanced"] as GradeLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onGradeLevelChange(lvl)}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  gradeLevel === lvl
                    ? "bg-[#6C5CE7] text-white font-bold shadow-xs"
                    : "text-[#636E72] hover:text-[#2D3436]"
                }`}
              >
                {lvl.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Speech Rate Control */}
          <div className="flex items-center bg-white border-2 border-[#FFEAA7] rounded-full px-2.5 py-1 text-xs font-semibold text-[#2D3436] shadow-xs">
            <Gauge size={13} className="mr-1 text-[#6C5CE7] hidden sm:block" />
            <select
              value={speed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="bg-transparent text-xs font-bold text-[#2D3436] focus:outline-none cursor-pointer"
              title="Speech Speed"
            >
              <option value="0.8">0.8x</option>
              <option value="1.0">1.0x</option>
              <option value="1.2">1.2x</option>
            </select>
          </div>

          {/* Voice Mute Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className={`p-2 rounded-full border-2 transition-all shadow-xs ${
              isMuted
                ? "bg-[#FFEDED] border-[#FF7675] text-[#FF7675]"
                : "bg-white border-[#55EFC4] text-[#22A6B3] hover:bg-[#DFF9FB]"
            }`}
            title={isMuted ? "Unmute Guru Voice" : "Mute Guru Voice"}
            id="navbar-mute-btn"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* History Button */}
          {history.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 rounded-full bg-white border-2 border-[#FFEAA7] text-[#2D3436] hover:border-[#6C5CE7] transition-all shadow-xs"
                title="Recent Topics"
                id="navbar-history-btn"
              >
                <History size={16} />
              </button>

              {showHistory && (
                <div className="absolute right-0 mt-2 w-60 bg-white border-2 border-[#FFEAA7] rounded-3xl p-3 shadow-xl z-50">
                  <p className="text-[10px] uppercase font-bold text-[#A0A0A0] px-2 py-1">
                    Recently Explored:
                  </p>
                  <div className="space-y-1 mt-1">
                    {history.map((h, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          onSearchNewTopic(h, gradeLevel);
                          setShowHistory(false);
                        }}
                        className="w-full text-left text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#FFF9E3] text-[#2D3436] truncate transition-colors"
                      >
                        • {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Student Avatar Tag */}
          <div className="w-9 h-9 bg-[#55EFC4] rounded-full flex items-center justify-center border-2 border-white shadow-xs font-bold text-xs text-[#2D3436]">
            ST
          </div>
        </div>
      </div>
    </header>
  );
}
