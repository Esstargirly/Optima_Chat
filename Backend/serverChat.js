import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

//increase size limit
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({limit: "10mb", extended: true}));

const API_URL = "https://api.mistral.ai/v1/chat/completions";

app.post("/chat", async (req, res) => {
    try {
        const {messages} = req.body;
        console.log(messages)

        console.log(process.env.apiKey)
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.apiKey}`,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                model: "mistral-small-latest",
                messages
            })
        });
        const data = await response.json();
        console.log(data)
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
//port
app.listen(3001, () => {
    console.log("Optima is running on http://localhost:3001");
});
