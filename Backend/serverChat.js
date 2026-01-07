import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_URL = "https://api.mistral.ai/v1/chat/completions";

app.post("/chat", async (req, res) => {
    try {
        const {message} = req.body;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.apiKey}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                model: "mistral-small-latest",
                message
            })
        });
        const data = await response.json();
        if (!response.ok) {
            return res.status(500).json({error: data.error?.message});
        }
        res.json({
            reply: data.choices[0].message.content
        });
    } catch (error){
        console.error(error);
        res.status(500).json ({error: "Server Error!"});
    }
});

app.listen(3000, () => {
    console.log("Optima is running on http://localhost:3000");
});