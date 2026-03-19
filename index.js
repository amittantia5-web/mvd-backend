const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

// AI ROUTE
app.post("/generate", async (req, res) => {
  try {
    const { input } = req.body;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: `Generate 5 unique pharma brand names for: ${input}. Only return names separated by comma.`
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.log("API ERROR:", err);
      return res.json({ result: "API Error: " + err });
    }

    const data = await response.json();

    let text = "No result";

    if (data.output && data.output.length > 0) {
      const content = data.output[0].content;

      if (content && content.length > 0) {
        text = content.map(c => c.text || "").join("");
      }
    }

    res.json({ result: text });

  } catch (error) {
    console.log("ERROR:", error);
    res.json({ result: "Server error" });
  }
});

// 🔥 FIXED PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});