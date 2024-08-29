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
        .then((response) => {
        response.json();
    })
        .then((data) => {
        if (data) {
            responseElement.innerHTML = data.message;
        }
    });
});
