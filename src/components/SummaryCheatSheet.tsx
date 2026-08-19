import { useState } from "react";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Award,
  Copy,
  Check,
  Volume2,
} from "lucide-react";
import { WhiteboardSummary } from "../types";

interface SummaryCheatSheetProps {
  summary: WhiteboardSummary;
  topic: string;
  onReadSummary: () => void;
}

export function SummaryCheatSheet({
  summary,
  topic,
  onReadSummary,
}: SummaryCheatSheetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyNotes = () => {
    const text = `=== ${topic} Summary Notes (by Guru AI) ===\n\n` +
      `Core Principles:\n${summary.corePrinciples.map((p) => `- ${p}`).join("\n")}\n\n` +
      `Common Pitfalls to Avoid:\n${summary.commonPitfalls.map((p) => `- ${p}`).join("\n")}\n\n` +
      `Golden Rule:\n${summary.goldenRule}\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-[2.5rem] bg-white border-4 border-[#FFEAA7] p-6 md:p-8 shadow-xl text-[#2D3436] relative overflow-hidden"
      id="summary-cheatsheet-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-[#FFEAA7] flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF9E3] text-[#6C5CE7] border-2 border-[#FFEAA7] flex items-center justify-center shadow-xs">
            <FileText size={24} />
          </div>
          <div>
            <span className="text-xs uppercase font-black tracking-wider text-[#6C5CE7]">
              Chalkboard Cheat Sheet
            </span>
            <h3 className="text-xl md:text-2xl font-black text-[#2D3436] tracking-tight">
              {summary.chalkboardTitle || `Summary: ${topic}`}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReadSummary}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#6C5CE7] hover:bg-[#5849C4] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            id="read-summary-btn"
          >
            <Volume2 size={15} />
            <span>Hear Summary</span>
          </button>

          <button
            type="button"
            onClick={handleCopyNotes}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FFF9E3] border-2 border-[#FFEAA7] text-xs font-bold text-[#2D3436] transition-all shadow-xs active:scale-95 cursor-pointer"
            id="copy-notes-btn"
          >
            {copied ? <Check size={15} className="text-[#00B894]" /> : <Copy size={15} />}
            <span>{copied ? "Copied!" : "Copy Notes"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Core Principles */}
        <div className="p-6 rounded-3xl bg-[#DFF9FB] border-2 border-[#C7ECEE] shadow-xs">
          <p className="text-xs font-black uppercase tracking-wider text-[#22A6B3] mb-3 flex items-center gap-1.5">
            <CheckCircle size={16} />
            Core Principles:
          </p>
          <ul className="space-y-3">
            {summary.corePrinciples.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-[#2D3436] font-semibold leading-snug">
                <span className="w-2 h-2 rounded-full bg-[#22A6B3] mt-1.5 shrink-0" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Pitfalls / Misconceptions */}
        <div className="p-6 rounded-3xl bg-[#FFEDED] border-2 border-[#FFD3D3] shadow-xs">
          <p className="text-xs font-black uppercase tracking-wider text-[#EB4D4B] mb-3 flex items-center gap-1.5">
            <AlertTriangle size={16} />
            Common Pitfalls & Misconceptions:
          </p>
          <ul className="space-y-3">
            {summary.commonPitfalls.map((pitfall, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-[#2D3436] font-semibold leading-snug">
                <span className="w-2 h-2 rounded-full bg-[#EB4D4B] mt-1.5 shrink-0" />
                <span>{pitfall}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Golden Rule */}
      <div className="p-6 rounded-3xl bg-[#FFF9E3] border-3 border-[#FFEAA7] flex items-start gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-white text-[#F1C40F] border border-[#FFEAA7] flex items-center justify-center shrink-0 shadow-xs">
          <Award size={24} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-[#6C5CE7] mb-1">
            Guru&apos;s Golden Rule:
          </p>
          <p className="text-base md:text-lg text-[#2D3436] font-black leading-relaxed">
            &ldquo;{summary.goldenRule}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
