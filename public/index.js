"use strict";
const userInput = document.querySelector(".userInput");
const responseElement = document.querySelector(".responseElement");
const btn = document.querySelector(".btn");
console.log(userInput, responseElement, btn);
// Generate a random user ID (in a real app, this would be a proper user authentication system)
const userId = Math.random().toString(36).substring(7);
btn.addEventListener("click", () => {
    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            input: userInput.value,
            userId: userId // Send the user ID with each request
        })
    })
        .then((response) => response.json())
        .then((data) => {
        if (data.message) {
            for (let i = 0; i < data.message.length; i++) {
                buildElement(data.message[i].content[0].text.value, data.message[i].role);
                console.log(data.message[i].role);
            }
        }
    });
    emptyElement(userInput);
});
function buildElement(text, role) {
    let newDiv = document.createElement("div");
    newDiv.classList.add("newDiv");
    let newContent = document.createTextNode(text);
    newDiv.appendChild(newContent);
    console.log(newContent);
    responseElement.appendChild(newDiv);
    role === "assistant" ? newDiv.classList.add("userNewDiv") : newDiv.classList.add("assistantNewDiv");
}
function emptyElement(element) {
    element.value = "";
}
// 1  why empyElement() not working:                            DONE
// 2 create a function for block of code within the for loop:   DONE
// 3 get rid of any types:                                      DONE
// 4 Api migth not remember context
// 5 Clean up code in server.js file
// 6 Udemy TS on interface                                      DONE
// 7 interfaces on EP                                           DONE
