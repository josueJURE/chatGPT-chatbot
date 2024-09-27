
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

app.get("/api", async (req, res) => {
    console.log(req.query)
    const { input, userId } = req.query;
    

    console.log(`####${typeof input}`)
    if (!input && !userId) {
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

    let assistantId;
    try {
        const myAssistant = await openai.beta.assistants.create({
            instructions: "You are the best Chef in the world. You give advice to people on how to cook",
            name: "Personalised Chef",
            tools: [{ type: "code_interpreter" }],
            model: "gpt-4",
        });
        assistantId = myAssistant.id;
    } catch (error) {
        console.error("Error creating assistant:", error);
        return res.status(500).json({ error: "Failed to create assistant" });
    }

    

    try {
        await openai.beta.threads.messages.create(threadId, {
            role: "user",
             content : input
            // content: input
           
            
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
                const lastMessageForRun = messages.data
                    .filter(message => message.run_id === run.id && message.role === "assistant")
                    .pop();

                if (lastMessageForRun) {
                    res.write(`data: ${JSON.stringify({ content: lastMessageForRun.content[0].text.value })}\n\n`);
                }
                break;
            } else if (runStatus.status === 'failed') {
                res.write(`data: ${JSON.stringify({ error: "Run failed" })}\n\n`);
                break;
            }
            
            // Wait for a short time before checking again
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (error) {
        console.error("Error during run:", error);
        res.write(`data: ${JSON.stringify({ error: "An error occurred during processing" })}\n\n`);
    }

    res.write('event: close\ndata: Stream finished\n\n');
    res.end();
});

app.use(express.static(path.join(__dirname, "public")));
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});



// require('dotenv').config(); /// Load environment variables from .env file
// const express = require("express");
// const app = express();
// const path = require("path");
// app.use(express.json()); // Add this line to parse JSON bodies
// const { OpenAI } = require("openai");



// const openai = new OpenAI({
//     apiKey: process.env.openaiAPI,
// });


// // / Create a Map to store threads for each user
// const userThreads = new Map();

// app.post("/", async (req, res) => {
//     const { input, userId } = req.body;

//     let threadId;
//     if (userThreads.has(userId)) {
//         threadId = userThreads.get(userId);
//     } else {
//         const messageThread = await openai.beta.threads.create();
//         threadId = messageThread.id;
//         userThreads.set(userId, threadId);
//     }

//     const myAssistant = await openai.beta.assistants.create({
//         instructions: "You are the best Chef in the world. You give advice to people on how to cook",
//         name: "Personalised Chef",
//         tools: [{ type: "code_interpreter" }],
//         model: "gpt-4",
//     });
//     const assistantId = myAssistant.id;

//     const message = await openai.beta.threads.messages.create(
//         threadId,
//         {
//             role: "user",
//             content: input
//         }
//     );
//     console.log(message);

//     let run = await openai.beta.threads.runs.createAndPoll(
//         threadId,
//         { 
//             assistant_id: assistantId,
//         }
//     );

//     if (run.status === 'completed') {
//         const messages = await openai.beta.threads.messages.list(
//             run.thread_id
//         );
//         for (const message of messages.data.reverse()) {
//             console.log(`${message.role} > ${message.content[0].text.value}`);
//         }
//         res.json({ message: messages.data });
//     } else {
//         console.log(run.status);
//         res.status(500).json({ error: "Run did not complete successfully" });
//     }
// });

// app.use(express.static((path.join(__dirname, "public"))))
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`)
// });