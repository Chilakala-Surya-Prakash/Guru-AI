import {
  TopicExplanation,
  VideoContent,
  VideoScene,
  TranscriptItem,
} from "../types";

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function ensureVideoContent(lesson: TopicExplanation): VideoContent {
  if (
    lesson.video &&
    Array.isArray(lesson.video.scenes) &&
    lesson.video.scenes.length > 0 &&
    Array.isArray(lesson.video.transcript) &&
    lesson.video.transcript.length > 0
  ) {
    return lesson.video;
  }

  // Construct scenes dynamically from lesson data
  const scenes: VideoScene[] = [];
  const transcript: TranscriptItem[] = [];
  let currentTime = 0;

  // Scene 1: Introduction (approx 20s)
  const introDuration = 20;
  const introEnd = currentTime + introDuration;
  const introNarration =
    lesson.speechScripts?.welcome ||
    `Welcome! Today we are exploring ${lesson.topic}. ${lesson.tagline}`;

  scenes.push({
    id: "scene-intro",
    chapterTitle: "Introduction & Big Picture",
    startTime: currentTime,
    endTime: introEnd,
    narration: introNarration,
    visual: {
      type: "intro",
      heading: lesson.title,
      subheading: lesson.tagline,
      keyTakeaway: lesson.whiteboardSummary?.goldenRule || "Master the core idea with an intuitive mental model.",
      bulletPoints: [
        lesson.tagline,
        `Topic: ${lesson.topic}`,
        `Field: ${lesson.subject}`,
        `Difficulty: ${lesson.difficulty}`,
      ],
    },
  });

  transcript.push({
    id: "t-intro",
    startTime: currentTime,
    endTime: introEnd,
    timeFormatted: formatTime(currentTime),
    text: introNarration,
  });

  currentTime = introEnd;

  // Scene 2: Everyday Analogy (approx 35s)
  const analogyDuration = 35;
  const analogyEnd = currentTime + analogyDuration;
  const analogyNarration =
    lesson.speechScripts?.analogy ||
    `Think of it like this: ${lesson.analogy?.story || lesson.analogy?.metaphor}`;

  scenes.push({
    id: "scene-analogy",
    chapterTitle: `Analogy: ${lesson.analogy?.title || "Everyday Metaphor"}`,
    startTime: currentTime,
    endTime: analogyEnd,
    narration: analogyNarration,
    visual: {
      type: "analogy",
      heading: lesson.analogy?.title || "The Everyday Metaphor",
      subheading: `Metaphor: ${lesson.analogy?.metaphor || ""}`,
      keyTakeaway: lesson.analogy?.metaphor || "Connecting new ideas to familiar concepts.",
      analogyStory: lesson.analogy?.story || "",
      bulletPoints: (lesson.analogy?.mapping || []).map(
        (m) => `${m.analogyItem} ➔ ${m.concept}`
      ),
    },
  });

  transcript.push({
    id: "t-analogy",
    startTime: currentTime,
    endTime: analogyEnd,
    timeFormatted: formatTime(currentTime),
    text: analogyNarration,
  });

  currentTime = analogyEnd;

  // Scenes 3..N: Step-by-Step Breakdown (approx 25s - 30s per step)
  const steps = lesson.steps || [];
  steps.forEach((step, idx) => {
    const stepDuration = 28;
    const stepEnd = currentTime + stepDuration;
    const stepNarration =
      lesson.speechScripts?.steps?.[idx] ||
      `Step ${step.stepNumber}: ${step.title}. ${step.content} For example: ${step.example}`;

    scenes.push({
      id: `scene-step-${step.stepNumber}`,
      chapterTitle: `Step ${step.stepNumber}: ${step.title}`,
      startTime: currentTime,
      endTime: stepEnd,
      narration: stepNarration,
      visual: {
        type: "diagram",
        heading: `Step ${step.stepNumber}: ${step.title}`,
        subheading: `Real-World: ${step.example}`,
        keyTakeaway: step.keyTakeaway,
        nodes: step.whiteboardDraw?.nodes || [],
        connections: step.whiteboardDraw?.connections || [],
        formulaOrCode: step.whiteboardDraw?.codeOrFormula,
        bulletPoints: [step.content, `Takeaway: ${step.keyTakeaway}`],
      },
    });

    transcript.push({
      id: `t-step-${step.stepNumber}`,
      startTime: currentTime,
      endTime: stepEnd,
      timeFormatted: formatTime(currentTime),
      text: stepNarration,
    });

    currentTime = stepEnd;
  });

  // Scene Final: Summary & Key Takeaway (approx 22s)
  const summaryDuration = 22;
  const summaryEnd = currentTime + summaryDuration;
  const summaryNarration =
    lesson.speechScripts?.wrapup ||
    `And that is ${lesson.topic}! Remember the golden rule: ${lesson.whiteboardSummary?.goldenRule || "Focus on the foundational building blocks."}`;

  scenes.push({
    id: "scene-summary",
    chapterTitle: "Summary & Golden Rule",
    startTime: currentTime,
    endTime: summaryEnd,
    narration: summaryNarration,
    visual: {
      type: "summary",
      heading: "Master Takeaways",
      subheading: lesson.whiteboardSummary?.chalkboardTitle || `${lesson.topic} Review`,
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
    text: summaryNarration,
  });

  currentTime = summaryEnd;

  return {
    totalDuration: currentTime,
    scenes,
    transcript,
  };
}
