import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: ["http://localhost:5173", "https://ai-chatbot-mern-app-frontend.onrender.com"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
}));

app.use(express.json());

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

let conversationHistory = [
  { role: "system", content: "You are a helpful assistant." },
];

app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;
  console.log("Received message:", userMessage);

  conversationHistory.push({ role: "user", content: userMessage });

  try {
    const completion = await openai.chat.completions.create({
      messages: conversationHistory,
      model: "llama3-70b-8192",
    });

    const botResponse = completion.choices[0].message.content;
    conversationHistory.push({ role: "assistant", content: botResponse });

    res.json({ message: botResponse });
  } catch (error) {
    console.error("GROQ Error:", error.response?.data || error.message);
    res.status(500).send("Error generating response from Groq");
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
