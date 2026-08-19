import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Zap,
  Box,
  Cpu,
  Globe,
  Sun,
  Droplets,
  Wind,
  Check,
  ArrowRight,
  RefreshCw,
  Eye,
  Layers,
  HelpCircle,
} from "lucide-react";
import { WhiteboardDrawData, WhiteboardNode } from "../types";

interface WhiteboardCanvasProps {
  drawData: WhiteboardDrawData;
  isGuruSpeaking: boolean;
  stepNumber: number;
}

export function WhiteboardCanvas({
  drawData,
  isGuruSpeaking,
  stepNumber,
}: WhiteboardCanvasProps) {
  const [boardTheme, setBoardTheme] = useState<"whiteboard" | "chalkboard" | "mint">("whiteboard");
  const [selectedNode, setSelectedNode] = useState<WhiteboardNode | null>(null);
  const [drawKey, setDrawKey] = useState(0);

  // Trigger redraw animation when step changes
  useEffect(() => {
    setDrawKey((prev) => prev + 1);
    setSelectedNode(null);
  }, [stepNumber, drawData]);

  // Helper to render relevant icon for whiteboard nodes
  const renderIcon = (type?: string) => {
    const className = "w-5 h-5";
    switch (type) {
      case "sun":
        return <Sun className={`${className} text-[#F1C40F] animate-spin-slow`} />;
      case "droplets":
        return <Droplets className={`${className} text-[#22A6B3]`} />;
      case "wind":
        return <Wind className={`${className} text-[#74B9FF]`} />;
      case "zap":
        return <Zap className={`${className} text-[#F1C40F]`} />;
      case "cpu":
        return <Cpu className={`${className} text-[#6C5CE7]`} />;
      case "globe":
        return <Globe className={`${className} text-[#0984E3]`} />;
      case "box":
        return <Box className={`${className} text-[#FF7675]`} />;
      case "combine":
        return <Layers className={`${className} text-[#6C5CE7]`} />;
      case "check":
        return <Check className={`${className} text-[#00B894]`} />;
      default:
        return <Sparkles className={`${className} text-[#6C5CE7]`} />;
    }
  };

  const themeStyles = {
    whiteboard: {
      container: "bg-white border-4 border-[#FFEAA7] text-[#2D3436] shadow-xl",
      grid: "bg-[radial-gradient(#FFEAA7_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70",
      nodeBg: "bg-[#FFFAF0] border-2 border-[#FFEAA7] hover:border-[#6C5CE7] text-[#2D3436] shadow-md",
      nodeHighlight: "bg-[#FFF9E3] border-3 border-[#6C5CE7] text-[#2D3436] shadow-xl ring-4 ring-[#6C5CE7]/10",
      chalkText: "font-mono text-[#6C5CE7]",
      arrow: "stroke-[#6C5CE7]",
      formulaBox: "bg-[#FFF9E3] border-2 border-[#F1C40F] text-[#2D3436] shadow-sm",
    },
    chalkboard: {
      container: "bg-[#2D3436] border-4 border-[#6C5CE7] text-white shadow-2xl",
      grid: "bg-[radial-gradient(#636E72_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40",
      nodeBg: "bg-[#353B48] border-2 border-[#74B9FF]/50 hover:border-[#55EFC4] text-white shadow-md",
      nodeHighlight: "bg-[#2F3542] border-3 border-[#55EFC4] text-white shadow-xl ring-4 ring-[#55EFC4]/20",
      chalkText: "font-mono text-[#55EFC4]",
      arrow: "stroke-[#55EFC4]",
      formulaBox: "bg-[#1E272E] border-2 border-[#55EFC4] text-[#55EFC4] shadow-sm",
    },
    mint: {
      container: "bg-[#DFF9FB] border-4 border-[#55EFC4] text-[#2D3436] shadow-xl",
      grid: "bg-[radial-gradient(#55EFC4_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-60",
      nodeBg: "bg-white border-2 border-[#C7ECEE] hover:border-[#22A6B3] text-[#2D3436] shadow-md",
      nodeHighlight: "bg-[#FFF9E3] border-3 border-[#22A6B3] text-[#2D3436] shadow-xl ring-4 ring-[#22A6B3]/15",
      chalkText: "font-mono text-[#22A6B3]",
      arrow: "stroke-[#22A6B3]",
      formulaBox: "bg-white border-2 border-[#22A6B3] text-[#2D3436] shadow-sm",
    },
  }[boardTheme];

  return (
    <div
      className={`relative rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between min-h-[460px] overflow-hidden transition-colors duration-400 ${themeStyles.container}`}
      id="whiteboard-canvas-card"
    >
      {/* Board Texture Grid */}
      <div className={`absolute inset-0 pointer-events-none ${themeStyles.grid}`} />

      {/* Top Whiteboard Bar & Controls */}
      <div className="relative z-10 flex items-center justify-between gap-4 pb-4 border-b border-black/10 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-[#55EFC4] border-2 border-white shadow-xs animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider opacity-70">
                Step {stepNumber} Sketch
              </span>
              {isGuruSpeaking && (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#6C5CE7] text-white font-bold animate-pulse shadow-xs">
                  Drawing Live...
                </span>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-black tracking-tight">{drawData.title}</h3>
          </div>
        </div>

        {/* Board Theme Switcher & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/5 rounded-full p-1 border border-black/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => setBoardTheme("whiteboard")}
              className={`px-3 py-1 rounded-full transition-all ${
                boardTheme === "whiteboard" ? "bg-[#6C5CE7] text-white shadow-xs" : "opacity-70 hover:opacity-100"
              }`}
              id="theme-whiteboard-btn"
            >
              Vibrant Studio
            </button>
            <button
              type="button"
              onClick={() => setBoardTheme("chalkboard")}
              className={`px-3 py-1 rounded-full transition-all ${
                boardTheme === "chalkboard" ? "bg-[#2D3436] text-white shadow-xs" : "opacity-70 hover:opacity-100"
              }`}
              id="theme-chalkboard-btn"
            >
              Dark Board
            </button>
            <button
              type="button"
              onClick={() => setBoardTheme("mint")}
              className={`px-3 py-1 rounded-full transition-all ${
                boardTheme === "mint" ? "bg-[#22A6B3] text-white shadow-xs" : "opacity-70 hover:opacity-100"
              }`}
              id="theme-mint-btn"
            >
              Mint Fresh
            </button>
          </div>

          <button
            type="button"
            onClick={() => setDrawKey((k) => k + 1)}
            className="p-2.5 rounded-full bg-white hover:bg-[#FFF9E3] border-2 border-[#FFEAA7] text-xs transition-all hover:scale-105 shadow-xs"
            title="Redraw Board Animation"
            id="redraw-board-btn"
          >
            <RefreshCw size={15} className="text-[#6C5CE7]" />
          </button>
        </div>
      </div>

      {/* Main Drawing Stage: Animated Elements */}
      <div key={drawKey} className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">
        {/* Layout according to draw type */}
        {drawData.type === "flow" || drawData.type === "diagram" || drawData.type === "cycle" ? (
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 flex-wrap">
            {drawData.nodes.map((node, index) => (
              <div key={node.id} className="flex items-center gap-3 md:gap-4 flex-col md:flex-row">
                {/* Node Box */}
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.22,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  onClick={() => setSelectedNode(node)}
                  className={`cursor-pointer rounded-3xl p-4 md:p-5 transition-all hover:scale-105 hover:-translate-y-1 w-48 md:w-56 text-left relative ${
                    node.highlight ? themeStyles.nodeHighlight : themeStyles.nodeBg
                  }`}
                  id={`whiteboard-node-${node.id}`}
                >
                  {/* Node Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-2xl bg-white/80 border border-black/5 shadow-xs">
                      {renderIcon(node.iconType)}
                    </div>
                    <span className="text-xs font-mono font-bold opacity-60">#{index + 1}</span>
                  </div>

                  <h4 className="font-bold text-base md:text-lg mb-1 leading-snug">{node.label}</h4>
                  {node.subtext && <p className="text-xs opacity-80 leading-snug font-medium">{node.subtext}</p>}

                  {/* Chalk highlight indicator */}
                  {node.highlight && (
                    <div className="absolute -top-2.5 -right-2.5 bg-[#FF7675] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md border border-white">
                      KEY CORE
                    </div>
                  )}
                </motion.div>

                {/* Arrow Connector between nodes */}
                {index < drawData.nodes.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.22 + 0.15, duration: 0.4 }}
                    className="flex flex-col items-center justify-center my-1 md:my-0"
                  >
                    <div className="flex items-center gap-1">
                      <div className="hidden md:flex items-center">
                        <div className="w-6 h-1 bg-[#6C5CE7] rounded-full" />
                        <ArrowRight size={18} className="text-[#6C5CE7] -ml-1 animate-pulse" />
                      </div>
                      <div className="md:hidden flex flex-col items-center">
                        <div className="h-6 w-1 bg-[#6C5CE7] rounded-full" />
                        <ArrowRight size={18} className="text-[#6C5CE7] rotate-90 -mt-1" />
                      </div>
                    </div>
                    {drawData.connections?.[index]?.label && (
                      <span className="text-[10px] font-bold text-[#6C5CE7] bg-white px-2 py-0.5 rounded-full border border-[#FFEAA7] mt-1 shadow-xs">
                        {drawData.connections[index].label}
                      </span>
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Comparison or Layers Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            {drawData.nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                onClick={() => setSelectedNode(node)}
                className={`cursor-pointer rounded-3xl p-5 transition-all hover:scale-102 ${
                  node.highlight ? themeStyles.nodeHighlight : themeStyles.nodeBg
                }`}
                id={`whiteboard-node-${node.id}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-2xl bg-white/80 shadow-xs">{renderIcon(node.iconType)}</div>
                  <h4 className="font-bold text-base">{node.label}</h4>
                </div>
                {node.subtext && <p className="text-xs opacity-80 leading-relaxed">{node.subtext}</p>}
              </motion.div>
            ))}
          </div>
        )}

        {/* Formula Box */}
        {drawData.codeOrFormula && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={`mt-6 px-6 py-3 rounded-2xl flex items-center gap-3 ${themeStyles.formulaBox}`}
            id="formula-chalk-box"
          >
            <span className="text-xs uppercase font-bold tracking-widest text-[#6C5CE7]">
              Formula:
            </span>
            <code className="text-sm md:text-base font-mono font-bold tracking-wide text-[#2D3436]">
              {drawData.codeOrFormula}
            </code>
          </motion.div>
        )}
      </div>

      {/* Selected Node Explainer Tooltip */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="relative z-20 mt-4 p-4 rounded-2xl bg-white border-2 border-[#6C5CE7] text-[#2D3436] shadow-xl flex items-center justify-between gap-3 text-sm"
          >
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-[#6C5CE7]" />
              <span>
                <strong className="text-[#6C5CE7]">{selectedNode.label}:</strong> {selectedNode.subtext || "Core component of this stage."}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="text-xs font-bold px-3 py-1.5 bg-[#FFFAF0] hover:bg-[#FFEAA7] border border-[#FFEAA7] rounded-xl text-[#2D3436]"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Tip */}
      <div className="relative z-10 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-semibold opacity-75">
        <div className="flex items-center gap-1.5">
          <HelpCircle size={14} className="text-[#6C5CE7]" />
          <span>Click any block on the board to inspect details</span>
        </div>
        <span className="font-mono text-[11px] text-[#6C5CE7]">Guru Vibrant Canvas v2.5</span>
      </div>
    </div>
  );
}
