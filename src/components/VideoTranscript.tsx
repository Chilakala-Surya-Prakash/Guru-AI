import React, { useRef, useEffect, useState } from "react";
import { Search, Volume2, FileText, ArrowRight } from "lucide-react";
import { TranscriptItem } from "../types";

interface VideoTranscriptProps {
  transcript: TranscriptItem[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export function VideoTranscript({
  transcript,
  currentTime,
  onSeek,
}: VideoTranscriptProps) {
  const [searchFilter, setSearchFilter] = useState("");
  const activeItemRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active transcript item into view
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentTime]);

  const filteredTranscript = transcript.filter((item) =>
    item.text.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div
      className="bg-white rounded-3xl border-2 border-[#FFEAA7] shadow-xl flex flex-col h-[520px] overflow-hidden"
      id="video-transcript-card"
    >
      {/* Transcript Header */}
      <div className="p-4 border-b-2 border-[#FFEAA7] flex items-center justify-between gap-3 bg-[#FFFAF0]">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-[#6C5CE7]" />
          <h3 className="font-black text-sm md:text-base text-[#2D3436]">
            Interactive Transcript
          </h3>
        </div>
        <span className="text-[11px] font-bold text-[#636E72] bg-white px-2.5 py-1 rounded-full border border-[#FFEAA7]">
          Live Sync
        </span>
      </div>

      {/* Search Filter */}
      <div className="p-3 border-b border-[#FFEAA7]/60 bg-white">
        <div className="relative flex items-center">
          <Search size={14} className="absolute left-3 text-[#A0A0A0]" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search words in transcript..."
            className="w-full bg-[#FFFAF0] border border-[#FFEAA7] focus:border-[#6C5CE7] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#2D3436] placeholder-[#A0A0A0] focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Transcript Scrollable Items */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-[#FFEAA7]/20"
      >
        {filteredTranscript.map((item) => {
          const isActive =
            currentTime >= item.startTime && currentTime <= item.endTime;

          return (
            <div
              key={item.id}
              ref={isActive ? activeItemRef : undefined}
              onClick={() => onSeek(item.startTime)}
              className={`p-3 rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${
                isActive
                  ? "bg-[#6C5CE7]/10 border-2 border-[#6C5CE7] shadow-sm"
                  : "hover:bg-[#FFFAF0] border border-transparent"
              }`}
            >
              {/* Timestamp Button */}
              <button
                type="button"
                className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold shrink-0 transition-colors ${
                  isActive
                    ? "bg-[#6C5CE7] text-white"
                    : "bg-[#FFEAA7]/60 text-[#2D3436] hover:bg-[#FFEAA7]"
                }`}
              >
                {item.timeFormatted}
              </button>

              {/* Spoken Text */}
              <p
                className={`text-xs md:text-sm leading-relaxed ${
                  isActive
                    ? "font-bold text-[#2D3436]"
                    : "font-medium text-[#636E72]"
                }`}
              >
                {item.text}
              </p>
            </div>
          );
        })}

        {filteredTranscript.length === 0 && (
          <div className="text-center py-8 text-xs text-[#636E72]">
            No matching transcript lines found.
          </div>
        )}
      </div>

      {/* Footer tip */}
      <div className="p-3 border-t border-[#FFEAA7] bg-[#FFFAF0] text-center text-[11px] font-semibold text-[#636E72]">
        💡 Click any line above to jump the video to that moment.
      </div>
    </div>
  );
}
