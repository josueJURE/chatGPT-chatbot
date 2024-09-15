"use strict";
const userInput = document.querySelector(".userInput");
const responseElement = document.querySelector(".responseElement");
const btn = document.querySelector(".btn");
const mainContainer = document.querySelector(".main-container");
// Generate a random user ID (in a real app, this would be a proper user authentication system)
const userId = Math.random().toString(36).substring(7);
// const userInputValue = userInput.value;
const processedIds = new Set();
const arrayIDs = [];
function createElement(classElement, textString) {
    let div = document.createElement("div");
    div.classList.add(classElement);
    div.textContent = textString;
    return div;
}
function appendElement(data) {
    if (responseElement instanceof HTMLElement) {
        data.role === "assistant" ? responseElement.appendChild(createElement("assistantNewDiv", data.text || "")) : userInput.value !== "" && responseElement.appendChild(createElement("userNewDiv", userInput.value));
    }
    else {
        console.error("Response element not found or is not an HTMLElement");
    }
}
btn.addEventListener("click", () => {
    if (userInput.value === "") {
        return alert("enter your question please");
    }
    appendElement({ text: userInput.value, role: "user" });
    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // convert  into JSON to send it to an API
            input: userInput.value,
            userId: userId, // Send the user ID with each request
        }),
    })
        .then((response) => {
        return response.status === 200 && response.ok
            ? response.json()
            : (() => {
                throw new Error("Something has gone wrong!");
            })(); ///In JavaScript, the ternary operator expects expressions on both sides of the colon. The throw statement is not an expression; it's a statement. Statements cannot be used where JavaScript expects an expression. Hence the immediately invoked function expression (IIFE)
    })
        .then((data) => {
        if (data.message) {
            console.log(data.message);
            for (let i = 0; i < data.message.length; i++) {
                let id = data.message[i].id;
                // if (!arrayIDs.includes(id)) {
                //   let text: string = data.message[i].content[0].text.value.trim();
                //   let role: string = data.message[i].role;
                //   // let messageObj: ChatgptData = {
                //   //   text: text,
                //   //   role: role,
                //   //   id: id,
                //   // };
                //   appendElement({
                //     text: text,
                //     role: role as "user" | "assistant",
                //     id: id,
                //   });
                //   // createAssistElement(messageObj);
                //   // console.log(messageObj)
                //   arrayIDs.push(id);
                //   console.log(arrayIDs);
                // }
                if (!processedIds.has(id)) {
                    let text = data.message[i].content[0].text.value;
                    let role = data.message[i].role;
                    let messageObj = {
                        text: text,
                        role: role,
                        id: id
                    };
                    appendElement(messageObj);
                    processedIds.add(id);
                    console.log({ elementData: messageObj.id });
                }
                console.log(data.message[i].role);
            }
        }
    });
    emptyElement(userInput);
});
function throwError() {
    throw new Error("something has gone wrong");
}
function emptyElement(element) {
    element.value = "";
}
// 15/09/24
// re-read your code base first
// user Set Object instead of arrayIDs.
// EXP: classes + notes
// EXP: read notes
// EXP next lesson,
// make it work: userInput.value !== "" &&  data.role === "user" ? responseElement.appendChild(createElement("userNewDiv", userInput.value )) : responseElement.appendChild(createElement( "assistantNewDiv", data.text || ""));
// Claude: Refactoring User and Assistant Elements in TypeScript
// Claude: Handling Undefined Elements in TypeScript
// Rename experimentalFunction();
// Clean up experimentalFunction()
// Get rid of count++
// Merge current branch to the main
// Ex P: classes
// why code doesn't work whenn I use const userInputValue = userInput.value. Read claude: Error with OpenAI API request
// Never Every TS:   throw new Error("Something has gone wrong!");
// EXP: never, finish writing notes
// merge createUserElement() and buildElement() into one
// generating effect
// notebook 68, object value at run time, tyoe widening.
// claude: Initializing Empty Objects in TypeScript:  "which is faster using arrayIDs or processedIds"
// why Object.values(emptyObj).includes(id) didn't work
// EXP  type guard  & coallescing null
//  ChatgptData can ? be removed
// 1  why empyElement() not working:                            DONE
// 2 create a function for block of code within the for loop:   DONE
// 3 get rid of any types:                                      DONE
// 4 Api migth not remember context
// 5 Clean up code in server.js file
// 6 Udemy TS on interface                                      DONE
// 7 interfaces on EP                                           DONE
// 6/09/24
// turn empyElement() into a generic  function
// try to use generics in ResponseData see Quiz: "Object Type With Holes" in EP
// EXP TS
// EXP JS Everyday TypeScript: The Object Type + Udemy lesson 96
// EXP redo JS JavaScript Concurrency: Promises Are Asynchronous: We've now seen the core idea in promises: they schedule code to run later, and we can add callback functions that will run after a promise fulfills. This shows us why promises are called promises: when we create one, we're promising to provide a value at some point in the future.
// EXP, TS: Exhaustiveness Checking redo it
// const names: Array<string | number> = []
// function merge<T, U>(objA: T, objB: U) {
//     return Object.assign(objA, objB);
// }
// console.log(merge({name: "Max"}, {age: 30}))
// const mergeObj = merge({name: "Max"}, {age: 30})
// mergeObj.age
