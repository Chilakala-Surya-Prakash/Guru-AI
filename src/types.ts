export type GradeLevel = "Elementary (Like I'm 10)" | "Middle School" | "High School" | "College / Advanced";

export interface MetaphorMapItem {
  concept: string;
  analogyItem: string;
  takeaway: string;
}

export interface WhiteboardNode {
  id: string;
  label: string;
  subtext?: string;
  iconType?: string;
  highlight?: boolean;
}

export interface WhiteboardConnection {
  from: string;
  to: string;
  label?: string;
}

export interface WhiteboardDrawData {
  type: "diagram" | "flow" | "comparison" | "cycle" | "layers" | "formula";
  title: string;
  nodes: WhiteboardNode[];
  connections?: WhiteboardConnection[];
  codeOrFormula?: string;
}

export interface LessonStep {
  stepNumber: number;
  title: string;
  content: string;
  example: string;
  whiteboardDraw: WhiteboardDrawData;
  keyTakeaway: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
}

export interface WhiteboardSummary {
  chalkboardTitle: string;
  corePrinciples: string[];
  commonPitfalls: string[];
  goldenRule: string;
}

export interface SpeechScripts {
  welcome: string;
  analogy: string;
  steps: string[];
  wrapup: string;
}

export interface TopicExplanation {
  topic: string;
  title: string;
  tagline: string;
  subject: string;
  difficulty: "Simple" | "Medium" | "Advanced";
  analogy: {
    title: string;
    metaphor: string;
    story: string;
    mapping: MetaphorMapItem[];
  };
  steps: LessonStep[];
  whiteboardSummary: WhiteboardSummary;
  speechScripts: SpeechScripts;
  quiz: QuizQuestion[];
  deepDivePrompts: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "guru";
  text: string;
  analogySnippet?: string;
  timestamp: string;
}
