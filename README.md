# Guru — AI Tutor for Students 🎓✨

> An interactive, zero-cost AI tutoring web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Google Gemini (`@google/genai`)**, featuring speech narration, dynamic chalkboard diagrams, intuitive analogies, and mini-quizzes.

---

## 🌟 Key Features

- **🗣️ Spoken Greeting & Audio Narration**: Guru welcomes students with animated avatar expressions and reads lessons aloud using the Web Speech API with adjustable speeds and mute toggle.
- **💡 Intuitive Everyday Analogies**: Breaks down complex science, math, coding, and history topics into easy-to-understand metaphors and concept mappings.
- **🎨 Interactive Chalkboard Whiteboard**: Step-by-step visual chalkboard sketches, cycle diagrams, and real-world examples for each phase of a topic.
- **🏆 Interactive Check-for-Understanding Quizzes**: Instant multiple-choice quizzes with explanations, hints, and confetti celebrations upon completion.
- **💬 Real-Time Guru Q&A Drawer**: Ask follow-up questions or request "Explain Like I'm 5" (ELIF5) ultra-simplified versions anytime.
- **🌈 Vibrant Palette Design**: High-contrast, pastel theme (`#FFFAF0` canvas, `#6C5CE7` accent, `#FFEAA7` borders) with fluid responsive animations powered by `motion`.

---

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti, Motion (`motion/react`)
- **Backend**: Express.js server with TypeScript runtime (`tsx`)
- **AI Engine**: Google Gemini API via official `@google/genai` SDK (`gemini-3.7-flash`)
- **Voice & Audio**: Web Speech API (`SpeechSynthesis`)

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Chilakala-Surya-Prakash/Guru-AI.git
cd Guru-AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file from `.env.example`:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📄 License
MIT
