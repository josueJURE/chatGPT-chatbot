"use strict";
const userInput = document.querySelector(".userInput");
const responseElement = document.querySelector(".responseElement");
const btn = document.querySelector(".btn");
const mainContainer = document.querySelector(".main-container");
const inputAndButton = document.querySelector(".inputAndButton");
// Generate a random user ID (in a real app, this would be a proper user authentication system)
const userId = Math.random().toString(36).substring(7);
const processedIds = new Set();
console.log(userInput);
function createElement(classElement, textString) {
    let div = document.createElement("div");
    div.classList.add(classElement);
    div.textContent = textString;
    return div;
}
function appendElement(data) {
    if (responseElement instanceof HTMLElement) {
        data.role === "assistant"
            ? responseElement.appendChild(createElement("assistantNewDiv", data.text || ""))
            : userInput.value !== "" &&
                responseElement.appendChild(createElement("userNewDiv", userInput.value));
    }
    else {
        console.error("Response element not found or is not an HTMLElement");
    }
}
function setElementDisplay(element, display) {
    element.style.display = display;
}
btn.addEventListener("click", () => {
    if (userInput.value === "") {
        return alert("enter your question please");
    }
    setElementDisplay(inputAndButton, "none");
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
                const throwError = () => {
                    throw new Error("Something has gone wrong!");
                };
                return throwError();
            })(); ///In JavaScript, the ternary operator expects expressions on both sides of the colon. The throw statement is not an expression; it's a statement. Statements cannot be used where JavaScript expects an expression. Hence the immediately invoked function expression (IIFE)
    })
        .then((data) => {
        if (data.message) {
            console.log(data.message);
            for (let i = 0; i < data.message.length; i++) {
                let id = data.message[i].id;
                if (!processedIds.has(id)) {
                    let text = data.message[i].content[0].text.value;
                    let role = data.message[i].role;
                    let messageObj = {
                        text: text,
                        role: role,
                        id: id,
                    };
                    appendElement(messageObj);
                    setElementDisplay(inputAndButton, "block");
                    processedIds.add(id);
                }
            }
        }
    });
    emptyElement(userInput);
});
function emptyElement(element) {
    element.value = "";
}
