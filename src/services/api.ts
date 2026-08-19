import { TopicExplanation, GradeLevel } from "../types";

export async function fetchTopicExplanation(
  topic: string,
  level: GradeLevel = "Middle School"
): Promise<TopicExplanation> {
  const res = await fetch("/api/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, level }),
  });

  if (!res.ok) {
    throw new Error(`Failed to load explanation: ${res.statusText}`);
  }

  const data = await res.json();
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response from server");
  }

  // Ensure robust properties so subcomponents render without null references
  return {
    topic: data.topic || topic,
    title: data.title || `Understanding ${topic}`,
    tagline: data.tagline || `Mastering ${topic} through intuitive visual analogies`,
    subject: data.subject || "General Science",
    difficulty: data.difficulty || "Simple",
    analogy: data.analogy || {
      title: "The Everyday Comparison",
      metaphor: `Understanding ${topic} through daily experience`,
      story: `Think of ${topic} as a coordinated team where each part has a specific responsibility that fits into the bigger picture.`,
      mapping: [],
    },
    steps: Array.isArray(data.steps) && data.steps.length > 0 ? data.steps : [
      {
        stepNumber: 1,
        title: "Introduction to the Concept",
        content: `At its core, ${topic} operates on steady, logical principles that build upon foundational building blocks.`,
        example: "Like organizing tools before starting a workshop project.",
        whiteboardDraw: {
          type: "diagram",
          title: "Core Foundation",
          nodes: [{ id: "n1", label: topic, subtext: "Central Concept", highlight: true }],
          connections: [],
        },
        keyTakeaway: `${topic} is made up of simple, orderly rules.`,
      },
    ],
    whiteboardSummary: data.whiteboardSummary || {
      chalkboardTitle: `${topic} Key Summary`,
      corePrinciples: [`${topic} works through clear, consistent steps.`],
      commonPitfalls: ["Overcomplicating the foundational basics."],
      goldenRule: "Start with simple analogies, then build up to advanced details!",
    },
    speechScripts: data.speechScripts || {
      welcome: `Welcome! Let's explore ${topic} together!`,
      analogy: `Here is a fun way to visualize ${topic}.`,
      steps: [`Let's look at step one of ${topic}.`],
      wrapup: `Great work exploring ${topic}!`,
    },
    quiz: Array.isArray(data.quiz) ? data.quiz : [],
    deepDivePrompts: Array.isArray(data.deepDivePrompts) ? data.deepDivePrompts : [],
  };
}

export async function askGuruQuestion(
  question: string,
  topic: string,
  currentStep?: string
): Promise<{ answer: string; analogySnippet?: string; speechScript: string }> {
  const res = await fetch("/api/ask-guru", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, topic, currentStep }),
  });

  if (!res.ok) {
    throw new Error(`Failed to ask Guru: ${res.statusText}`);
  }

  return res.json();
}

export async function fetchSimplerAnalogy(
  topic: string,
  context?: string
): Promise<{ superSimpleAnalogy: string; everydayStory: string }> {
  const res = await fetch("/api/simplify-more", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, context }),
  });

  if (!res.ok) {
    throw new Error(`Failed to simplify: ${res.statusText}`);
  }

  return res.json();
}
