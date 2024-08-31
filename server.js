require('dotenv').config(); /// Load environment variables from .env file
const express = require("express");
const app = express();
const path = require("path");
app.use(express.json()); // Add this line to parse JSON bodies
const { OpenAI } = require("openai");



const openai = new OpenAI({
    apiKey: process.env.openaiAPI,
});


// / Create a Map to store threads for each user
const userThreads = new Map();

app.post("/", async (req, res) => {
    const { input, userId } = req.body;
    console.log(input);

    let threadId;
    if (userThreads.has(userId)) {
        threadId = userThreads.get(userId);
    } else {
        const messageThread = await openai.beta.threads.create();
        threadId = messageThread.id;
        userThreads.set(userId, threadId);
    }

    const myAssistant = await openai.beta.assistants.create({
        instructions: "You are the best Chef in the world. You give advice to people on how to cook",
        name: "Personalised Chef",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4",
    });
    const assistantId = myAssistant.id;

    const message = await openai.beta.threads.messages.create(
        threadId,
        {
            role: "user",
            content: input
        }
    );
    console.log(message);

    let run = await openai.beta.threads.runs.createAndPoll(
        threadId,
        { 
            assistant_id: assistantId,
        }
    );

    if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(
            run.thread_id
        );
        for (const message of messages.data.reverse()) {
            console.log(`${message.role} > ${message.content[0].text.value}`);
        }
        res.json({ message: messages.data });
    } else {
        console.log(run.status);
        res.status(500).json({ error: "Run did not complete successfully" });
    }
});

app.use(express.static((path.join(__dirname, "public"))))
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});