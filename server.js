require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());
const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.openaiAPI,
});

// Create a Map to store threads for each user
const userThreads = new Map();

// Create the assistant once and store its ID
let assistantId;

async function createAssistant() {
    try {
        const myAssistant = await openai.beta.assistants.create({
            instructions: "You are the best Chef in the world. You give advice to people on how to cook. Refuse non cooking related subjects.",
            name: "Personalised Chef",
            tools: [{ type: "code_interpreter" }],
            model: "gpt-4",
        });
        assistantId = myAssistant.id;
    } catch (error) {
        console.error("Error creating assistant:", error);
        throw error;
    }
}

createAssistant();

// Move chunkText outside the route handler
async function chunkText(res, content, status) {
    const chunks = content.split(/(?<=\.\s|\?\s|\!\s)/g); // Split on sentence endings
    for (const chunk of chunks) {
        if (chunk.trim()) {
            res.write(`data: ${JSON.stringify({content: chunk.trim(), status: status})}\n\n`);
        }
    }
}

app.get("/api", async (req, res) => {
    const { input, userId } = req.query;

    if (!input || !userId) {
        return res.status(400).json({ error: "Missing input or userId" });
    }

    let threadId;
    if (userThreads.has(userId)) {
        threadId = userThreads.get(userId);
    } else {
        const messageThread = await openai.beta.threads.create();
        threadId = messageThread.id;
        userThreads.set(userId, threadId);
    }

    try {
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: input
        });
    } catch (error) {
        console.error("Error creating message:", error);
        return res.status(400).json({ error: "Failed to create message" });
    }

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    try {
        const run = await openai.beta.threads.runs.create(threadId, { assistant_id: assistantId });

        while (true) {
            const runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
            
            if (runStatus.status === 'completed') {
                const messages = await openai.beta.threads.messages.list(threadId);
                console.log(messages)
                const lastMessageForRun = messages.data
                    .filter(message => message.run_id === run.id && message.role === "assistant")
                    .pop();

                if (lastMessageForRun) {
                    const content = lastMessageForRun.content[0]?.text?.value || "";
                    console.log(messages)
                    await chunkText(res, content, 'completed');
                }
                break;
            } else if (runStatus.status === 'in_progress') {
                const messages = await openai.beta.threads.messages.list(threadId);
                const inProgressMessages = messages.data
                    .filter(message => message.run_id === run.id && message.role === "assistant");

                for (const message of inProgressMessages) {
                    const content = message.content[0]?.text?.value || "";
                    await chunkText(res, content, 'in_progress');
                }
            } else if (runStatus.status === 'failed') {
                res.write(`data: ${JSON.stringify({ error: "Run failed", status: 'failed' })}\n\n`);
                break;
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (error) {
        console.error("Error during run:", error);
        res.write(`data: ${JSON.stringify({ error: "An error occurred during processing", status: 'error' })}\n\n`);
    }

    res.write('event: close\ndata: Stream finished\n\n');
    res.end();
});

app.use(express.static(path.join(__dirname, "public")));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});






