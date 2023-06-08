// all routes pointing to open ai
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { openai } from "../main.js";

dotenv.config();
const router = express.Router();

// Routes
router.post("/text", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      {
        text: response.data.choices[0].text,
      },
      {
        headers: {
          "Project-ID": process.env.REACT_APP_CHAT_ENGINE_ID,
          "User-Name": process.env.REACT_APP_CHAT_ENGINE_USERNAME,
          "User-Secret": process.env.REACT_APP_CHAT_ENGINE_SECRET,
        },
      }
    );

    res.status(200).json({ text: response.data.choices[0].text });
    console.log("RESPONSE TEXT", response.data);
  } catch (err) {
    console.error("ERROR", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

router.post("/code", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;
    console.log("router.post  text:", text);

    const response = await openai.createCompletion({
      model: "code-davinci-002",
      prompt: text,
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    console.log("router.post  response:", response.data.choices[0].text);

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      {
        text: response.data.choices[0].text,
      },
      {
        headers: {
          "Project-ID": process.env.REACT_APP_CHAT_ENGINE_ID,
          "User-Name": process.env.REACT_APP_CHAT_ENGINE_USERNAME,
          "User-Secret": process.env.REACT_APP_CHAT_ENGINE_SECRET,
        },
      }
    );

    res.status(200).json({ text: response.data.choices[0].text });
    // console.log("RESPONSE CODE", response.data);
  } catch (err) {
    console.error("ERROR", err.response.data.error);
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;
