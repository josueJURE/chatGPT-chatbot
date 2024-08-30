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
                let newDiv = document.createElement("div");
                let newContent = data.message[i].content[0].text.value;
                console.log(newContent);
                responseElement.innerHTML = newContent;
            }
            // responseElement.innerHTML = data.message[0].content[0].text.value /// do I need the return keyword?
            console.log(typeof data.message);
        }
    });
});
