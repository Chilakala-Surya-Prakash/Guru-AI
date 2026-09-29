import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize,
  Minimize,
  Subtitles,
  Sparkles,
  Zap,
  Globe,
  Cpu,
  Box,
  Layers,
  Check,
  ArrowRight,
  Sun,
  Droplets,
  Wind,
  Compass,
  FastForward,
  Rewind,
  BookOpen,
} from "lucide-react";
import { VideoContent, VideoScene, TranscriptItem } from "../types";
import { formatTime } from "../services/videoHelper";
import { speechService } from "../services/speech";
import { GuruAvatar } from "./GuruAvatar";

interface YouTubeVideoPlayerProps {
  video: VideoContent;
  topic: string;
  title: string;
  level: string;
  currentTime: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onPlayStateChange: (playing: boolean) => void;
  onSeek: (time: number) => void;
}

export function YouTubeVideoPlayer({
  video,
  topic,
  title,
  level,
  currentTime,
  isPlaying,
  onTimeUpdate,
  onPlayStateChange,
  onSeek,
}: YouTubeVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(speechService.getIsMuted());
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showCC, setShowCC] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpokenSceneIdRef = useRef<string | null>(null);

  const totalDuration = video.totalDuration || 120;

  // Determine current scene based on currentTime
  const currentScene: VideoScene = useMemo(() => {
    if (!video.scenes || video.scenes.length === 0) {
      return {
        id: "default",
        chapterTitle: title,
        startTime: 0,
        endTime: totalDuration,
        narration: "",
        visual: {
          type: "intro",
          heading: title,
          keyTakeaway: "Understanding the core concept.",
        },
      };
    }
    const found = video.scenes.find(
      (s) => currentTime >= s.startTime && currentTime < s.endTime
    );
    return found || video.scenes[video.scenes.length - 1];
  }, [video.scenes, currentTime, totalDuration, title]);

  // Determine active subtitle text from transcript
  const activeSubtitle = useMemo(() => {
    if (!video.transcript || video.transcript.length === 0) return null;
    const item = video.transcript.find(
      (t) => currentTime >= t.startTime && currentTime <= t.endTime
    );
    return item ? item.text : null;
  }, [video.transcript, currentTime]);

  // Handle Play/Pause
  const togglePlay = () => {
    const nextState = !isPlaying;
    onPlayStateChange(nextState);
    if (!nextState) {
      speechService.stop();
    } else {
      triggerSceneSpeech(currentScene);
    }
  };

  // Audio Narration Synchronization
  const triggerSceneSpeech = (scene: VideoScene) => {
    if (speechService.muted) return;
    if (scene.narration && lastSpokenSceneIdRef.current !== scene.id) {
      lastSpokenSceneIdRef.current = scene.id;
      speechService.stop();
      speechService.speak(scene.narration);
    }
  };

  // Sync speech when scene changes while playing
  useEffect(() => {
    if (isPlaying && currentScene) {
      triggerSceneSpeech(currentScene);
    }
  }, [currentScene?.id, isPlaying]);

  // Auto-hide controls when playing
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Keyboard controls (Space = play/pause, Left/Right = skip 5s)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        onSeek(Math.min(totalDuration, currentTime + 5));
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        onSeek(Math.max(0, currentTime - 5));
      } else if (e.code === "KeyM") {
        e.preventDefault();
        toggleMute();
      } else if (e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, currentTime, totalDuration]);

  // Mute / Unmute
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    speechService.setMuted(next);
    if (next) {
      speechService.stop();
    } else if (isPlaying && currentScene) {
      lastSpokenSceneIdRef.current = null;
      triggerSceneSpeech(currentScene);
    }
  };

  // Speed
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    speechService.setRate(speed);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Playback timer ticker when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (currentTime >= totalDuration) {
        onPlayStateChange(false);
        speechService.stop();
        return;
      }
      const nextTime = Math.min(totalDuration, +(currentTime + 0.25 * playbackSpeed).toFixed(2));
      onTimeUpdate(nextTime);
    }, 250);

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, totalDuration, playbackSpeed, onTimeUpdate, onPlayStateChange]);

  // Scrubber calculation on progress bar
  const calculateSeekTime = (clientX: number) => {
    if (!progressBarRef.current) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return +(pos * totalDuration).toFixed(2);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const seekTime = calculateSeekTime(e.clientX);
    lastSpokenSceneIdRef.current = null; // force re-speak on seek
    onSeek(seekTime);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const seekTime = calculateSeekTime(e.clientX);
      onSeek(seekTime);
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, totalDuration]);

  const handleProgressBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * totalDuration);
  };

  const handleProgressBarMouseLeave = () => {
    setHoverTime(null);
  };

  // Node Icon helper
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
        return <Sparkles className={`${className} text-[#FFEAA7]`} />;
    }
  };

  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full aspect-video bg-[#0F0F12] rounded-3xl overflow-hidden shadow-2xl select-none group border-2 border-black/20 ${
        isFullscreen ? "rounded-none h-screen w-screen" : ""
      }`}
      id="youtube-player-container"
    >
      {/* Background Chalkboard Grid Studio Canvas */}
      <div className="absolute inset-0 bg-[#1A1A24] bg-[radial-gradient(#2E2E3E_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

      {/* Decorative Glow */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#6C5CE7]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#FF0000]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar Inside Video */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white text-xs font-bold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#FF0000] animate-pulse" />
            <span>Guru Video Studio</span>
            <span className="text-white/40">|</span>
            <span className="text-[#FFEAA7] font-semibold">{level}</span>
          </div>

          <div className="hidden sm:flex items-center bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white/80 text-xs font-medium">
            <span>{currentScene?.chapterTitle}</span>
          </div>
        </div>

        {/* Live Speaking Badge */}
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-white shadow-lg">
          <GuruAvatar isSpeaking={isPlaying} size="sm" mood="explaining" />
          <span className="hidden sm:inline">
            {isPlaying ? "Narration Playing" : "Paused"}
          </span>
        </div>
      </div>

      {/* Center Stage: Animated Video Visuals */}
      <div
        onClick={togglePlay}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 md:p-12 cursor-pointer pb-20 pt-16"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene?.id || "empty"}
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-4xl mx-auto flex flex-col items-center text-center justify-center space-y-4"
          >
            {/* Visual Header */}
            <div>
              <span className="text-xs uppercase tracking-widest font-black text-[#55EFC4] bg-[#55EFC4]/10 px-3 py-1 rounded-full border border-[#55EFC4]/20">
                {currentScene?.chapterTitle}
              </span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mt-2 tracking-tight drop-shadow-md">
                {currentScene?.visual?.heading || currentScene?.chapterTitle}
              </h2>
              {currentScene?.visual?.subheading && (
                <p className="text-sm md:text-base text-white/70 font-medium mt-1 max-w-xl mx-auto">
                  {currentScene.visual.subheading}
                </p>
              )}
            </div>

            {/* Visual Type Specific Content */}
            {currentScene?.visual?.type === "analogy" && currentScene.visual.analogyStory && (
              <div className="bg-white/10 backdrop-blur-md border-2 border-[#FFEAA7]/40 rounded-3xl p-5 md:p-6 max-w-2xl text-left shadow-2xl">
                <div className="flex items-center gap-2 text-xs uppercase font-black text-[#FFEAA7] mb-2">
                  <BookOpen size={16} />
                  <span>The Analogy Metaphor</span>
                </div>
                <p className="text-sm md:text-lg text-white font-medium leading-relaxed italic">
                  &ldquo;{currentScene.visual.analogyStory}&rdquo;
                </p>
              </div>
            )}

            {/* Visual Nodes & Diagrams (Flow / Steps) */}
            {currentScene?.visual?.nodes && currentScene.visual.nodes.length > 0 && (
              <div className="w-full flex items-center justify-center gap-3 md:gap-5 flex-wrap my-2">
                {currentScene.visual.nodes.map((node, idx) => (
                  <React.Fragment key={node.id}>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.12 }}
                      className={`p-3 md:p-4 rounded-2xl flex items-center gap-3 border shadow-xl text-left min-w-[130px] md:min-w-[170px] ${
                        node.highlight
                          ? "bg-[#6C5CE7]/30 border-[#55EFC4] text-white ring-2 ring-[#55EFC4]/30"
                          : "bg-white/10 border-white/15 text-white"
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-black/40">
                        {renderIcon(node.iconType)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs md:text-sm">{node.label}</h4>
                        {node.subtext && (
                          <p className="text-[10px] md:text-xs text-white/70">
                            {node.subtext}
                          </p>
                        )}
                      </div>
                    </motion.div>

                    {idx < (currentScene.visual.nodes?.length || 0) - 1 && (
                      <ArrowRight size={18} className="text-[#55EFC4] shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Bullet Points / Facts */}
            {currentScene?.visual?.bulletPoints &&
              currentScene.visual.bulletPoints.length > 0 &&
              !currentScene.visual.nodes?.length && (
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
                  {currentScene.visual.bulletPoints.map((point, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/90 text-xs md:text-sm font-medium backdrop-blur-xs"
                    >
                      • {point}
                    </span>
                  ))}
                </div>
              )}

            {/* Formula / Takeaway Box */}
            {currentScene?.visual?.formulaOrCode && (
              <div className="bg-[#FFEAA7]/15 border border-[#FFEAA7]/50 rounded-2xl px-5 py-2.5 backdrop-blur-md">
                <code className="text-xs md:text-sm font-mono font-bold text-[#FFEAA7]">
                  {currentScene.visual.formulaOrCode}
                </code>
              </div>
            )}

            {/* Core Takeaway Pill */}
            {currentScene?.visual?.keyTakeaway && (
              <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs md:text-sm text-white/90 font-medium">
                💡 <strong className="text-[#FFEAA7]">Key Takeaway:</strong>{" "}
                {currentScene.visual.keyTakeaway}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Center Big Play/Pause Button when paused */}
        {!isPlaying && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute z-20 w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform"
          >
            <Play size={40} className="ml-2 text-white fill-white" />
          </motion.div>
        )}
      </div>

      {/* Closed Captions Subtitle Overlay (YouTube Style) */}
      <AnimatePresence>
        {showCC && activeSubtitle && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 max-w-[85%] text-center pointer-events-none"
          >
            <span className="bg-black/80 text-white text-xs md:text-base font-bold px-4 py-1.5 rounded-xl border border-white/10 shadow-lg leading-relaxed inline-block">
              {activeSubtitle}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YouTube Controls Overlay (Bottom) */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-8 pb-3 px-4 md:px-6 ${
          controlsVisible || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* THE YOUTUBE RED SCRUBBER BAR */}
        <div
          ref={progressBarRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleProgressBarMouseMove}
          onMouseLeave={handleProgressBarMouseLeave}
          className="relative w-full h-1.5 hover:h-3 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer transition-all mb-3 group/bar"
          id="youtube-red-progress-bar"
        >
          {/* Chapter Markers / Ticks along the scrubber */}
          {video.scenes?.map((scene) => {
            if (scene.startTime === 0) return null;
            const markerPos = (scene.startTime / totalDuration) * 100;
            return (
              <div
                key={scene.id}
                style={{ left: `${markerPos}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-black/60 z-10 pointer-events-none"
              />
            );
          })}

          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div
              style={{ left: `${hoverPosition}%` }}
              className="absolute -top-9 -translate-x-1/2 bg-black/90 text-white text-[11px] font-bold px-2 py-0.5 rounded border border-white/20 pointer-events-none shadow-md z-30 whitespace-nowrap"
            >
              {formatTime(hoverTime)}
            </div>
          )}

          {/* Red Progress Bar */}
          <div
            style={{ width: `${progressPercent}%` }}
            className="absolute top-0 bottom-0 left-0 bg-[#FF0000] rounded-full transition-all duration-75 relative"
          >
            {/* Scrubber Knob Thumb */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#FF0000] scale-0 group-hover/bar:scale-100 transition-transform shadow-md" />
          </div>
        </div>

        {/* YouTube Bottom Controls Bar */}
        <div className="flex items-center justify-between text-white text-xs font-semibold gap-2">
          {/* Left Controls: Play, Skip, Volume, Time */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white cursor-pointer"
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
              id="player-play-pause-btn"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="fill-white" />}
            </button>

            <button
              type="button"
              onClick={() => onSeek(Math.max(0, currentTime - 5))}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white cursor-pointer"
              title="Skip back 5s (←)"
            >
              <Rewind size={18} />
            </button>

            <button
              type="button"
              onClick={() => onSeek(Math.min(totalDuration, currentTime + 5))}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white cursor-pointer"
              title="Skip forward 5s (→)"
            >
              <FastForward size={18} />
            </button>

            {/* Volume / Mute */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white cursor-pointer"
              title={isMuted ? "Unmute (m)" : "Mute (m)"}
              id="player-mute-btn"
            >
              {isMuted ? <VolumeX size={18} className="text-[#FF7675]" /> : <Volume2 size={18} />}
            </button>

            {/* Timecode */}
            <div className="text-xs font-mono font-medium text-white/90 ml-1">
              <span>{formatTime(currentTime)}</span>
              <span className="text-white/40 mx-1">/</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Right Controls: CC, Speed, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Closed Captions CC */}
            <button
              type="button"
              onClick={() => setShowCC(!showCC)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                showCC
                  ? "bg-white text-black font-black"
                  : "hover:bg-white/20 text-white/70 hover:text-white"
              }`}
              title="Subtitles / Closed Captions"
              id="player-cc-btn"
            >
              <Subtitles size={17} />
            </button>

            {/* Playback Speed Selector */}
            <div className="relative group/speed">
              <button
                type="button"
                className="px-2 py-1 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white text-xs font-bold"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover/speed:flex flex-col bg-black/90 border border-white/20 rounded-xl p-1 shadow-2xl z-40">
                {[0.75, 1.0, 1.25, 1.5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSpeedChange(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      playbackSpeed === s
                        ? "bg-[#FF0000] text-white"
                        : "text-white/80 hover:bg-white/20"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/80 hover:text-white cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen (f)" : "Fullscreen (f)"}
              id="player-fullscreen-btn"
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
