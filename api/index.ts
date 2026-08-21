import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

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
  return JSON.parse(cleaned);
}

async function generateJsonWithGemini(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction?: string,
  timeoutMs: number = 8500
): Promise<any> {
  const modelCandidates = [
    "gemini-3.7-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
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

      return res.status(200).json({
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
      });
    }

    const prompt = `You are "Guru", a charismatic, encouraging AI tutor for students.
Explain the topic: "${topic}" to a ${level} student using clear analogies, step-by-step visual chalkboard examples, and simple real-world comparisons.
Return valid JSON with: topic, title, tagline, subject, difficulty, analogy, steps (with whiteboardDraw), whiteboardSummary, speechScripts, quiz, deepDivePrompts.`;

    const parsed = await generateJsonWithGemini(ai, prompt);
    return res.json(parsed);
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Failed to generate lesson" });
  }
});

app.post("/api/ask-guru", async (req, res) => {
  try {
    const { question, topic } = req.body;
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
