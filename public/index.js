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
        if (data) {
            // responseElement.innerHTML = data.message[0].content[0].text.value /// do I need the return keyword?
            responseElement.innerHTML = data.message; /// do I need the return keyword?
            console.log(data.message);
        }
    });
});
