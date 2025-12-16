const express = require('express');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000; 

const YOUR_HARDCODED_API_KEY = "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";

const openai = new OpenAI({ apiKey: YOUR_HARDCODED_API_KEY }); 

app.get('/', (req, res) => {
    res.json({
        author: "Server",
        status: "OpenAI Chat API is running.",
        instructions: "Use GET request to /chat/Your_Question_Here"
    });
});

app.get('/chat/:prompt', async (req, res) => {
    const userPrompt = req.params.prompt; 

    if (!userPrompt) {
        return res.status(400).json({
            author: "Server",
            error: "Prompt is missing in the URL path."
        });
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {"role": "system", "content": "তুমি একজন সহায়ক এবং অভিজ্ঞ এআই সহকারী।"},
                {"role": "user", "content": userPrompt}
            ],
            temperature: 0.8,
            max_tokens: 200 
        });

        const chatReply = response.choices[0].message.content.trim();

        res.json({
            author: "Gemini AI Assistant (via OpenAI API)",
            prompt_sent: userPrompt,
            reply: chatReply,
            model_used: response.model,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            author: "Server",
            error: "Failed to communicate with the OpenAI API."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
