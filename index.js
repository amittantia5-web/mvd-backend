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

// 🔥 REAL AI ROUTE
app.post("/generate", async (req, res) => {
  try {
    const { input } = req.body;

    console.log("Request received:", input);

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

    // 🔴 Check error
    if (!response.ok) {
      const err = await response.text();
      console.log("API ERROR:", err);
      return res.json({ result: "API Error: " + err });
    }

    const data = await response.json();

    console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));

    let text = "No result";

    if (data.output && data.output.length > 0) {
      text = data.output[0].content[0].text;
    }

    res.json({ result: text });

  } catch (error) {
    console.log("ERROR:", error);
    res.json({ result: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://127.0.0.1:5000");
});