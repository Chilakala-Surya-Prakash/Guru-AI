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

  return res.json();
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
