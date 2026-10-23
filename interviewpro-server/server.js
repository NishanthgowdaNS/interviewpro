import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
];

// Helper: send instructions + a message to the AI, get text back
async function askAI(system, userText, maxTokens = 500) {
  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: userText,
        config: {
          systemInstruction: system,
          maxOutputTokens: maxTokens,
        },
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err) {
      lastError = err;
      console.warn(`Model ${model} failed, trying next...`, err.message || err);
    }
  }

  throw lastError || new Error("Failed to generate content from AI models");
}

// Helper: turn the AI's text into a JavaScript object
function parseJSON(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in response");
  }
  return JSON.parse(text.slice(start, end + 1));
}

app.get("/", (req, res) => {
  res.send("InterviewPro server is running!");
});

// Endpoint 1: generate one interview question
app.post("/question", async (req, res) => {
  try {
    const { role, type, previousQuestions = [] } = req.body || {};

    if (!role || !type) {
      return res.status(400).json({ error: "role and type are required" });
    }

    const system =
      "You are a professional interviewer. Ask exactly ONE interview question. " +
      "Return only the question text, nothing else.";

    const prompt =
      `Role: ${role}\n` +
      `Interview type: ${type}\n` +
      `Do not repeat these questions:\n${previousQuestions.join("\n") || "none"}`;

    const rawQuestion = await askAI(system, prompt);
    const question = rawQuestion.trim();
    res.json({ question });
  } catch (err) {
    console.error("Error generating question:", err);
    res.status(500).json({ error: "Could not generate question" });
  }
});

// Endpoint 2: score the user's answer
app.post("/evaluate", async (req, res) => {
  try {
    const { role, question, answer } = req.body || {};

    if (!question || !answer) {
      return res.status(400).json({ error: "question and answer are required" });
    }

    const system =
      "You are a fair, encouraging interview coach. Evaluate the candidate's answer. " +
      "Respond ONLY with JSON in exactly this shape: " +
      '{"score": <number from 0 to 10>, "strengths": "<text>", ' +
      '"improvements": "<text>", "better_answer": "<text>"}. ' +
      "Do not write anything outside the JSON.";

    const prompt =
      `Role: ${role || "Candidate"}\n` +
      `Question: ${question}\n` +
      `Candidate's answer: ${answer}`;

    const reply = await askAI(system, prompt, 1000);
    const result = parseJSON(reply);
    res.json(result);
  } catch (err) {
    console.error("Error evaluating answer:", err);
    res.status(500).json({ error: "Could not evaluate answer" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});