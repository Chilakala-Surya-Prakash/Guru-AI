import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

// Simple in-memory rate limiter: max 10 requests per 60s per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60_000;

function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return next();
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: "Too many requests. Please wait a moment." });
  }
  next();
}

app.use("/api", rateLimit);

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function cleanAndParseJSON(rawText: string): any {
  if (!rawText) return null;
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

async function generateJsonWithGemini(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction?: string,
  timeoutMs: number = 8500
): Promise<any> {
  const modelCandidates = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-3.7-flash",
    "gemini-flash-latest",
  ];

  let lastError: any = null;

  for (const modelName of modelCandidates) {
    try {
      const callPromise = ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          ...(systemInstruction ? { systemInstruction } : {}),
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms on ${modelName}`)), timeoutMs)
      );

      const response = await Promise.race([callPromise, timeoutPromise]);
      const text = response.text;
      if (text) {
        const parsed = cleanAndParseJSON(text);
        if (parsed) return parsed;
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error("All Gemini models failed to produce a response");
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function buildVideoContent(lesson: any) {
  if (
    lesson.video &&
    Array.isArray(lesson.video.scenes) &&
    lesson.video.scenes.length > 0 &&
    Array.isArray(lesson.video.transcript) &&
    lesson.video.transcript.length > 0
  ) {
    return lesson.video;
  }

  const scenes: any[] = [];
  const transcript: any[] = [];
  let currentTime = 0;

  const introEnd = 20;
  const introText =
    lesson.speechScripts?.welcome ||
    `Welcome! Let's explore ${lesson.topic}. ${lesson.tagline || ""}`;

  scenes.push({
    id: "scene-1",
    chapterTitle: "Introduction & Big Picture",
    startTime: 0,
    endTime: introEnd,
    narration: introText,
    visual: {
      type: "intro",
      heading: lesson.title || lesson.topic,
      subheading: lesson.tagline || `An intuitive breakdown of ${lesson.topic}`,
      keyTakeaway: lesson.whiteboardSummary?.goldenRule || "Understand the foundational concept.",
      bulletPoints: [
        lesson.tagline,
        `Topic: ${lesson.topic}`,
        `Difficulty: ${lesson.difficulty || "Simple"}`
      ].filter(Boolean),
    },
  });

  transcript.push({
    id: "t-1",
    startTime: 0,
    endTime: introEnd,
    timeFormatted: "0:00",
    text: introText,
  });

  currentTime = introEnd;

  const analogyEnd = currentTime + 35;
  const analogyText =
    lesson.speechScripts?.analogy ||
    lesson.analogy?.story ||
    "Here is an everyday analogy to make this concept click instantly.";

  scenes.push({
    id: "scene-2",
    chapterTitle: `Analogy: ${lesson.analogy?.title || "Everyday Metaphor"}`,
    startTime: currentTime,
    endTime: analogyEnd,
    narration: analogyText,
    visual: {
      type: "analogy",
      heading: lesson.analogy?.title || "Everyday Metaphor",
      subheading: lesson.analogy?.metaphor,
      keyTakeaway: lesson.analogy?.metaphor || "Connecting new ideas to familiar concepts.",
      analogyStory: lesson.analogy?.story,
      bulletPoints: (lesson.analogy?.mapping || []).map(
        (m: any) => `${m.analogyItem} ➔ ${m.concept}`
      ),
    },
  });

  transcript.push({
    id: "t-2",
    startTime: currentTime,
    endTime: analogyEnd,
    timeFormatted: formatTime(currentTime),
    text: analogyText,
  });

  currentTime = analogyEnd;

  const steps = lesson.steps || [];
  steps.forEach((step: any, idx: number) => {
    const stepDuration = 28;
    const stepEnd = currentTime + stepDuration;
    const stepText =
      lesson.speechScripts?.steps?.[idx] ||
      `Step ${step.stepNumber || idx + 1}: ${step.title}. ${step.content} ${
        step.example ? `For example: ${step.example}` : ""
      }`;

    scenes.push({
      id: `scene-step-${idx + 1}`,
      chapterTitle: `Step ${step.stepNumber || idx + 1}: ${step.title}`,
      startTime: currentTime,
      endTime: stepEnd,
      narration: stepText,
      visual: {
        type: "diagram",
        heading: step.title,
        subheading: step.example ? `Example: ${step.example}` : undefined,
        keyTakeaway: step.keyTakeaway || "Key mechanism in action.",
        nodes: step.whiteboardDraw?.nodes || [],
        connections: step.whiteboardDraw?.connections || [],
        formulaOrCode: step.whiteboardDraw?.codeOrFormula,
        bulletPoints: [step.content, step.keyTakeaway].filter(Boolean),
      },
    });

    transcript.push({
      id: `t-step-${idx + 1}`,
      startTime: currentTime,
      endTime: stepEnd,
      timeFormatted: formatTime(currentTime),
      text: stepText,
    });

    currentTime = stepEnd;
  });

  const summaryEnd = currentTime + 22;
  const summaryText =
    lesson.speechScripts?.wrapup ||
    `And that is ${lesson.topic}! Remember the golden rule: ${
      lesson.whiteboardSummary?.goldenRule || "Focus on the foundational building blocks."
    }`;

  scenes.push({
    id: "scene-summary",
    chapterTitle: "Summary & Golden Rule",
    startTime: currentTime,
    endTime: summaryEnd,
    narration: summaryText,
    visual: {
      type: "summary",
      heading: "Master Takeaway",
      subheading: lesson.whiteboardSummary?.chalkboardTitle || "Lesson Summary",
      keyTakeaway: lesson.whiteboardSummary?.goldenRule || "Master the core principle.",
      bulletPoints: (lesson.whiteboardSummary?.corePrinciples || []).slice(0, 3),
      formulaOrCode: lesson.whiteboardSummary?.goldenRule,
    },
  });

  transcript.push({
    id: "t-summary",
    startTime: currentTime,
    endTime: summaryEnd,
    timeFormatted: formatTime(currentTime),
    text: summaryText,
  });

  currentTime = summaryEnd;

  return {
    totalDuration: currentTime,
    scenes,
    transcript,
  };
}

app.post("/api/explain", async (req, res) => {
  try {
    const { topic, level = "Middle School" } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    const ai = getGeminiClient();
    if (!ai) {
      const difficulty = level.includes("Elementary")
        ? "Simple"
        : level.includes("College")
        ? "Advanced"
        : "Medium";

      const fallbackLesson: any = {
        topic,
        title: `Understanding ${topic}`,
        tagline: `An intuitive guide to ${topic}`,
        subject: "General Science",
        difficulty,
        analogy: {
          title: "The Team Workshop",
          metaphor: "A cooperative workshop where parts work in harmony",
          story: `Think of ${topic} as a skilled workshop team where each helper handles their own station before passing the work along.`,
          mapping: []
        },
        steps: [
          {
            stepNumber: 1,
            title: "Foundational Step",
            content: `The initial state of ${topic} brings together necessary resources and energy.`,
            example: "Like organizing tools before crafting a project.",
            whiteboardDraw: {
              type: "diagram",
              title: "Step 1: Setup",
              nodes: [{ id: "n1", label: topic, highlight: true }],
              connections: []
            },
            keyTakeaway: "Every system begins with simple initial elements."
          }
        ],
        whiteboardSummary: {
          chalkboardTitle: `${topic} Summary`,
          corePrinciples: [`${topic} follows structured, orderly steps.`],
          commonPitfalls: ["Overcomplicating the basics."],
          goldenRule: "Master the foundational steps first!"
        },
        speechScripts: {
          welcome: `Welcome! Let's explore ${topic} together!`,
          analogy: `Here is a fun way to visualize ${topic}.`,
          steps: [`Let's review step one of ${topic}.`],
          wrapup: `Great job mastering ${topic}!`
        },
        quiz: [],
        deepDivePrompts: []
      };
      fallbackLesson.video = buildVideoContent(fallbackLesson);
      return res.status(200).json(fallbackLesson);
    }

    const prompt = `You are "Guru", a charismatic, encouraging AI tutor for students.
Explain the topic: "${topic}" to a ${level} student using clear analogies, step-by-step visual chalkboard examples, and simple real-world comparisons.
Return valid JSON with: topic, title, tagline, subject, difficulty, analogy, steps (with whiteboardDraw), whiteboardSummary, speechScripts, quiz, deepDivePrompts.`;

    const parsed = await generateJsonWithGemini(ai, prompt);
    parsed.video = buildVideoContent(parsed);
    return res.json(parsed);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to generate lesson" });
  }
});

app.post("/api/ask-guru", async (req, res) => {
  try {
    const { question, topic = "this concept" } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        answer: `Great question about **${topic}**! In simple terms, systems work by balancing inputs and outputs step-by-step.`,
        analogySnippet: "Like adding an extra checkout lane at the grocery store to keep traffic moving!",
        speechScript: `Awesome question about ${topic}! Remember, big ideas are made of simple building blocks!`
      });
    }

    const prompt = `Student studying "${topic}" asks: "${question}". Explain simply in under 3 paragraphs with bold highlights and an analogy. Return JSON with: answer, analogySnippet, speechScript.`;
    const parsed = await generateJsonWithGemini(ai, prompt);
    return res.json(parsed);
  } catch (err: any) {
    return res.json({
      answer: "That's a fantastic question! In simple terms, think of it like building with Lego bricks: every system is made from simple pieces working in harmony.",
      analogySnippet: "Like gears in a clock moving together seamlessly.",
      speechScript: "Great question! Remember, every big concept is just simple building blocks clicking together!"
    });
  }
});

app.post("/api/simplify-more", async (req, res) => {
  try {
    const { topic } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        superSimpleAnalogy: `Imagine building a tower out of wooden blocks: start with a strong base!`,
        everydayStory: `Just like sharing cookies with friends on the playground, everyone gets an equal piece!`
      });
    }

    const prompt = `Explain "${topic}" to a 7-year-old child using toys or animals. Return JSON with: superSimpleAnalogy, everydayStory.`;
    const parsed = await generateJsonWithGemini(ai, prompt);
    return res.json(parsed);
  } catch (err: any) {
    return res.json({
      superSimpleAnalogy: `Imagine building a tower out of wooden blocks: start with a strong base!`,
      everydayStory: `Just like sharing cookies with friends on the playground, everyone gets an equal piece!`
    });
  }
});

export default app;
