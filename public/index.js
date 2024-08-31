"use strict";
const userInput = document.querySelector(".userInput");
const responseElement = document.querySelector(".responseElement");
const btn = document.querySelector(".btn");
console.log(userInput, responseElement, btn);
btn.addEventListener("click", () => {
    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: userInput.value })
    })
        .then((response) => response.json())
        .then((data) => {
        if (data.message) {
            for (let i = 0; i < data.message.length; i++) {
                buildElement(data.message[i].content[0].text.value);
            }
            console.log(typeof data.message);
        }
    });
    emptyElement(userInput);
});
function buildElement(text) {
    let newDiv = document.createElement("div");
    newDiv.classList.add("newDiv");
    let newContent = document.createTextNode(text);
    newDiv.appendChild(newContent);
    console.log(newContent);
    responseElement.appendChild(newDiv);
}
function emptyElement(element) {
    element.value = "";
}
// 1  why empyElement() not working: DONE
// 2 create a function for block of code within the for loop: DONE
// 3 get rid of any types
// 4 Api migth not remember context
// 5 Clean up code in server.js file
// 6 Udemy TS on interface
