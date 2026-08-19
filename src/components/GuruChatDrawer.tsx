import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Bot,
  User,
  Lightbulb,
} from "lucide-react";
import { ChatMessage, TopicExplanation } from "../types";
import { askGuruQuestion } from "../services/api";
import { speechService, createSpeechRecognizer } from "../services/speech";
import { GuruAvatar } from "./GuruAvatar";

interface GuruChatDrawerProps {
  lesson: TopicExplanation;
  currentStepIndex: number;
}

export function GuruChatDrawer({ lesson, currentStepIndex }: GuruChatDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-chat",
      sender: "guru",
      text: `Have any questions about **${lesson.title}** or step ${currentStepIndex + 1}? Ask me anything and I'll break it down with an analogy!`,
      timestamp: "Just now",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ start: () => void; stop: () => void; isSupported: boolean } | null>(null);

  useEffect(() => {
    const unsub = speechService.onSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });
    return unsub;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    recognitionRef.current = createSpeechRecognizer(
      (transcript) => {
        setInputVal(transcript);
      },
      () => {
        setIsListening(false);
      }
    );
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current?.isSupported) {
      alert("Voice recognition is not supported in this browser.");
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

  const handleSendMessage = async (customPrompt?: string) => {
    const query = customPrompt || inputVal;
    if (!query.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsThinking(true);

    try {
      const stepTitle = lesson.steps[currentStepIndex]?.title;
      const res = await askGuruQuestion(query, lesson.topic, stepTitle);

      const guruMsg: ChatMessage = {
        id: `guru-${Date.now()}`,
        sender: "guru",
        text: res.answer,
        analogySnippet: res.analogySnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, guruMsg]);
      speechService.speak(res.speechScript || res.analogySnippet || res.answer);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: `guru-${Date.now()}`,
          sender: "guru",
          text: "Think of this concept as a balancing scale: whenever you change one side, the other side adjusts to keep harmony. Try exploring the steps on the chalkboard!",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button from Vibrant Theme */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3.5 rounded-[2rem] bg-[#6C5CE7] hover:bg-[#5849C4] text-white font-black shadow-2xl border-2 border-white cursor-pointer"
        id="open-guru-chat-btn"
      >
        <GuruAvatar isSpeaking={isSpeaking} size="sm" />
        <span className="text-sm">Ask Guru</span>
        <div className="w-2.5 h-2.5 rounded-full bg-[#55EFC4] animate-ping" />
      </motion.button>

      {/* Slide-in Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-[#FFFAF0] border-l-4 border-[#FFEAA7] h-full flex flex-col shadow-2xl text-[#2D3436]"
              id="guru-chat-drawer"
            >
              {/* Header */}
              <div className="p-4 border-b-2 border-[#FFEAA7] flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <GuruAvatar isSpeaking={isSpeaking} size="sm" />
                  <div>
                    <h3 className="font-black text-sm text-[#2D3436] flex items-center gap-1.5">
                      <span>Guru Q&A Assistant</span>
                      <Sparkles size={14} className="text-[#F1C40F]" />
                    </h3>
                    <p className="text-[11px] font-semibold text-[#636E72]">
                      Topic: {lesson.topic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => speechService.stop()}
                    className="p-1.5 rounded-full text-[#636E72] hover:text-[#2D3436] hover:bg-[#FFF9E3]"
                    title="Stop Voice"
                  >
                    <VolumeX size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full text-[#636E72] hover:text-[#2D3436] hover:bg-[#FFF9E3]"
                    title="Close Drawer"
                    id="close-guru-chat-btn"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${
                      m.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs shrink-0 shadow-xs ${
                        m.sender === "user"
                          ? "bg-[#6C5CE7] text-white font-bold"
                          : "bg-white text-[#2D3436] border-2 border-[#FFEAA7]"
                      }`}
                    >
                      {m.sender === "user" ? <User size={15} /> : <Bot size={15} className="text-[#6C5CE7]" />}
                    </div>

                    <div
                      className={`max-w-[82%] p-4 rounded-3xl text-xs md:text-sm leading-relaxed ${
                        m.sender === "user"
                          ? "bg-[#6C5CE7] text-white font-semibold rounded-tr-xs shadow-sm"
                          : "bg-white border-2 border-[#FFEAA7] text-[#2D3436] font-medium rounded-tl-xs shadow-xs"
                      }`}
                    >
                      <div className="whitespace-pre-line">{m.text}</div>

                      {m.analogySnippet && (
                        <div className="mt-2.5 pt-2.5 border-t border-[#FFEAA7] flex items-start gap-1.5 text-xs text-[#2D3436] bg-[#FFF9E3] p-2 rounded-xl">
                          <Lightbulb size={13} className="shrink-0 mt-0.5 text-[#F1C40F]" />
                          <span>
                            <strong>Analogy:</strong> {m.analogySnippet}
                          </span>
                        </div>
                      )}

                      <div className="mt-1.5 text-[9px] font-bold opacity-50 text-right">
                        {m.timestamp}
                      </div>
                    </div>
                  </div>
                ))}

                {isThinking && (
                  <div className="flex items-center gap-2 text-xs text-[#636E72] font-semibold italic p-2">
                    <Sparkles size={14} className="animate-spin text-[#6C5CE7]" />
                    <span>Guru is thinking of a great analogy...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Curiosity Starters */}
              {lesson.deepDivePrompts && lesson.deepDivePrompts.length > 0 && (
                <div className="px-4 py-3 border-t-2 border-[#FFEAA7] bg-white">
                  <p className="text-[10px] uppercase font-black text-[#A0A0A0] mb-1.5">
                    💡 Suggested Follow-Up Questions:
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {lesson.deepDivePrompts.slice(0, 2).map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        className="text-left text-xs font-semibold text-[#6C5CE7] hover:text-[#5849C4] hover:bg-[#FFF9E3] p-2 rounded-xl truncate transition-colors border border-transparent hover:border-[#FFEAA7]"
                      >
                        • {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form */}
              <div className="p-3 border-t-2 border-[#FFEAA7] bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={toggleVoice}
                    className={`p-2.5 rounded-full transition-all ${
                      isListening
                        ? "bg-[#FF7675] text-white animate-pulse"
                        : "bg-[#FFFAF0] border-2 border-[#FFEAA7] text-[#636E72] hover:text-[#6C5CE7]"
                    }`}
                    title={isListening ? "Listening... click to send" : "Speak to Guru"}
                    id="chat-mic-btn"
                  >
                    {isListening ? <Mic size={16} /> : <MicOff size={16} />}
                  </button>

                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Ask Guru anything..."
                    className="flex-1 bg-[#FFFAF0] border-2 border-[#FFEAA7] focus:border-[#6C5CE7] rounded-full px-4 py-2.5 text-xs md:text-sm font-medium text-[#2D3436] placeholder-[#A0A0A0] focus:outline-none transition-all"
                    id="chat-input-field"
                  />

                  <button
                    type="submit"
                    disabled={!inputVal.trim() || isThinking}
                    className="p-2.5 rounded-full bg-[#6C5CE7] hover:bg-[#5849C4] text-white transition-all disabled:opacity-40 cursor-pointer shadow-sm"
                    id="send-chat-btn"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
