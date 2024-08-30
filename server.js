require('dotenv').config(); /// Load environment variables from .env file
const express = require("express");
const app = express();
const path = require("path");
app.use(express.json()); // Add this line to parse JSON bodies
const { OpenAI } = require("openai");



const openai = new OpenAI({
    apiKey: process.env.openaiAPI,
});


app.post("/", async (req, res) => {
    const { input } = req.body;
    console.log(input);


    const myAssistant = await openai.beta.assistants.create({
      instructions:
        "You are the best Chef in the world. You give advice to people onn how to cook",
      name: "Personalised Chef",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4o",
    });


    const assistantId = myAssistant.id

  
  

  
    // const messageThread = await openai.beta.threads.create({
    //   // previous conversations
    //   messages: [
    //     {
    //       role: "user",
    //       content: !input ? "I need advice on cooking" : input
    //     },
    //     {
    //       role: "assistant",
    //       content: "sure I'm here to help if you want any advice on cuisine"
    //     }
    //   ],
  
 
    // })

    const messageThread = await openai.beta.threads.create()

    const threadId =  messageThread.id

    console.log({myThread: threadId})

    // const myThread = await openai.beta.threads.retrieve(
    //   threadId
    // )
    // console.log({myThread: myThread.tool_resources.code_interpreter})

    const message = await openai.beta.threads.messages.create(
      threadId ,
      {
        role: "user",
        content: input
      }
    );


    console.log(message)

    let run = await openai.beta.threads.runs.createAndPoll(
      threadId,
      { 
        assistant_id: assistantId,
        // instructions: "Please address the user as Jane Doe. The user has a premium account."
      }
    );

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(
        run.thread_id
      );
      for (const message of messages.data.reverse()) {

        console.log({ojbect_response: message.content})
        console.log({ojbect_data: message.data})

        console.log(`${message.role} > ${message.content[0].text.value}`);

      }
     
        res.json({ message : messages.data});

  
      
    } else {
      console.log(run.status);
    }

    
    
});





app.use(express.static((path.join(__dirname, "public"))))
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});


