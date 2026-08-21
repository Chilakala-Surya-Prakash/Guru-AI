import { TopicExplanation, GradeLevel } from "../types";
import { generateClientLessonFallback, CURATED_LESSONS } from "./curriculumFallback";

export async function fetchTopicExplanation(
  topic: string,
  level: GradeLevel = "Middle School"
): Promise<TopicExplanation> {
  const cleanTopic = topic.trim();
  const normalizedKey = cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Fast check: If it matches a curated lesson directly, we can use it or fetch live
  try {
    const res = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: cleanTopic, level }),
    });

    if (res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data && typeof data === "object" && data.title && Array.isArray(data.steps)) {
          return {
            topic: data.topic || cleanTopic,
            title: data.title,
            tagline: data.tagline || `Mastering ${cleanTopic} with Guru`,
            subject: data.subject || "General Science",
            difficulty: data.difficulty || "Simple",
            analogy: data.analogy || {
              title: "Everyday Analogy",
              metaphor: `Visualizing ${cleanTopic}`,
              story: `Think of ${cleanTopic} as a coordinated team working together in harmony.`,
              mapping: [],
            },
            steps: data.steps,
            whiteboardSummary: data.whiteboardSummary || {
              chalkboardTitle: `${cleanTopic} Summary`,
              corePrinciples: [`${cleanTopic} works through steady, orderly steps.`],
              commonPitfalls: ["Overcomplicating the basics."],
              goldenRule: "Master the fundamental steps first!",
            },
            speechScripts: data.speechScripts || {
              welcome: `Welcome! Let's explore ${cleanTopic} together.`,
              analogy: `Here is a helpful way to think about ${cleanTopic}.`,
              steps: [`Step one of ${cleanTopic}.`],
              wrapup: `Great work exploring ${cleanTopic}!`,
            },
            quiz: Array.isArray(data.quiz) ? data.quiz : [],
            deepDivePrompts: Array.isArray(data.deepDivePrompts) ? data.deepDivePrompts : [],
          };
        }
      }
    }
  } catch (netErr) {
    console.warn("Backend API not reachable (e.g. Vercel static host or offline). Using Guru engine:", netErr);
  }

  // Seamless fallback for Vercel static hosting and offline usage
  return generateClientLessonFallback(cleanTopic, level);
}

export async function askGuruQuestion(
  question: string,
  topic: string,
  currentStep?: string
): Promise<{ answer: string; analogySnippet?: string; speechScript: string }> {
  try {
    const res = await fetch("/api/ask-guru", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, topic, currentStep }),
    });

    if (res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await res.json();
      }
    }
  } catch (err) {
    console.warn("Using offline Guru Q&A engine:", err);
  }

  return {
    answer: `Great question about **${topic}**! In simple terms, think of it like this: every complex system relies on fundamental building blocks interacting under steady laws. When you examine ${question.slice(0, 45)}..., the key is observing how energy, matter, and information transfer from step to step without breaking balance.`,
    analogySnippet: `Like adding an extra checkout lane at a grocery store during rush hour: it keeps everything flowing smoothly without creating chaos!`,
    speechScript: `Awesome question about ${topic}! Remember, whenever things seem complicated, look for the simple building blocks working together!`,
  };
}

export async function fetchSimplerAnalogy(
  topic: string,
  context?: string
): Promise<{ superSimpleAnalogy: string; everydayStory: string }> {
  try {
    const res = await fetch("/api/simplify-more", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, context }),
    });

    if (res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await res.json();
      }
    }
  } catch (err) {
    console.warn("Using offline simpler analogy:", err);
  }

  return {
    superSimpleAnalogy: `Imagine building a LEGO castle: start with a sturdy baseplate, click each brick into place, and you end up with something awesome! That is exactly how ${topic} works!`,
    everydayStory: `Just like sharing slices of pizza at a birthday party so everyone gets their favorite part, ${topic} balances and shares its energy!`,
  };
}
