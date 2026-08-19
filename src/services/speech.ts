/**
 * Voice synthesis and speech recognition service for Guru AI Tutor.
 * 100% client-side Web Speech API (zero cost, zero external API keys required).
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isMuted: boolean = false;
  private speechRate: number = 1.0;
  private onSpeakingChangeCallbacks: ((isSpeaking: boolean) => void)[] = [];
  private onBoundaryCallbacks: ((charIndex: number, text: string) => void)[] = [];

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    // Prefer friendly, high-quality natural voices
    const preferredVoices = [
      "Google US English",
      "Microsoft Jenny Online (Natural)",
      "Microsoft Guy Online (Natural)",
      "Samantha",
      "Daniel",
      "Aaron",
      "Fred",
      "en-US",
      "en-GB",
    ];

    for (const name of preferredVoices) {
      const match = this.voices.find(
        (v) => v.name.includes(name) || v.lang.includes(name)
      );
      if (match) {
        this.selectedVoice = match;
        break;
      }
    }

    if (!this.selectedVoice && this.voices.length > 0) {
      this.selectedVoice = this.voices.find((v) => v.lang.startsWith("en")) || this.voices[0];
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public setVoice(voiceName: string) {
    const found = this.voices.find((v) => v.name === voiceName);
    if (found) {
      this.selectedVoice = found;
    }
  }

  public getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.selectedVoice;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.synth) {
      this.stop();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setRate(rate: number) {
    this.speechRate = Math.max(0.6, Math.min(1.8, rate));
  }

  public getRate(): number {
    return this.speechRate;
  }

  public onSpeakingChange(cb: (isSpeaking: boolean) => void) {
    this.onSpeakingChangeCallbacks.push(cb);
    return () => {
      this.onSpeakingChangeCallbacks = this.onSpeakingChangeCallbacks.filter((c) => c !== cb);
    };
  }

  public onBoundary(cb: (charIndex: number, text: string) => void) {
    this.onBoundaryCallbacks.push(cb);
    return () => {
      this.onBoundaryCallbacks = this.onBoundaryCallbacks.filter((c) => c !== cb);
    };
  }

  private notifySpeaking(speaking: boolean) {
    this.onSpeakingChangeCallbacks.forEach((cb) => cb(speaking));
  }

  public speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
      priority?: boolean;
    }
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth || this.isMuted || !text.trim()) {
        options?.onEnd?.();
        resolve();
        return;
      }

      // Stop previous utterance
      this.stop();

      // Clean text of markdown stars/hashes before speaking for natural speech
      const cleaned = text
        .replace(/[*_#`~[\]]/g, "")
        .replace(/\((.*?)\)/g, "$1")
        .replace(/\n+/g, " ");

      const utterance = new SpeechSynthesisUtterance(cleaned);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = this.speechRate;
      utterance.pitch = 1.05; // Friendly energetic pitch for AI tutor

      utterance.onstart = () => {
        this.notifySpeaking(true);
        options?.onStart?.();
      };

      utterance.onboundary = (e) => {
        this.onBoundaryCallbacks.forEach((cb) => cb(e.charIndex, cleaned));
      };

      utterance.onend = () => {
        this.notifySpeaking(false);
        this.currentUtterance = null;
        options?.onEnd?.();
        resolve();
      };

      utterance.onerror = () => {
        this.notifySpeaking(false);
        this.currentUtterance = null;
        options?.onError?.();
        resolve();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
      this.notifySpeaking(false);
    }
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

export const speechService = new SpeechService();

// Voice Recognition helper for voice search / asking questions
export function createSpeechRecognizer(
  onResult: (transcript: string) => void,
  onEnd?: () => void
): { start: () => void; stop: () => void; isSupported: boolean } {
  const isSupported =
    typeof window !== "undefined" &&
    ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

  if (!isSupported) {
    return {
      start: () => {},
      stop: () => {},
      isSupported: false,
    };
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event: any) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      transcript += event.results[i][0].transcript;
    }
    onResult(transcript);
  };

  recognition.onend = () => {
    onEnd?.();
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (e) {
        console.warn("Speech recognition already active or error:", e);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {}
    },
    isSupported: true,
  };
}
