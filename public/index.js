"use strict";
const userInput = document.querySelector(".userInput");
const responseElement = document.querySelector(".responseElement");
const btn = document.querySelector(".btn");
const mainContainer = document.querySelector(".main-container");
const inputAndButton = document.querySelector(".inputAndButton");
// Generate a random user ID (in a real app, this would be a proper user authentication system)
const userId = Math.random().toString(36).substring(7);
function createElement(classElement, textString) {
    let textContainer = document.createElement("textarea");
    textContainer.setAttribute("disabled", "true");
    textContainer.classList.add(classElement);
    textContainer.value += textString;
    return textContainer;
}
function appendElement(data) {
    if (responseElement instanceof HTMLElement) {
        data.role === "assistant"
            ? responseElement.appendChild(createElement("assistantNewDiv", "generating recipe"))
            : userInput.value !== "" && responseElement.appendChild(createElement("userNewDiv", userInput.value));
    }
    else {
        console.error("Response element not found or is not an HTMLElement");
    }
}
function setElementDisplay(element, display) {
    element.classList.remove("displayNone", "display");
    element.classList.add(display);
}
btn.addEventListener("click", () => {
    if (userInput.value === "") {
        return alert("enter your question please");
    }
    setElementDisplay(inputAndButton, "displayNone");
    appendElement({ text: userInput.value, role: "user" });
    appendElement({ role: "assistant" });
    const eventSource = new EventSource(`/api?input=${encodeURIComponent(userInput.value)}&userId=${userId}`);
    let isFirstResponse = true;
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.content) {
            if (responseElement.lastChild instanceof HTMLElement && responseElement.lastChild.classList.contains('assistantNewDiv')) {
                const textArea = responseElement.lastChild;
                if (isFirstResponse) {
                    textArea.value = "";
                }
                textArea.value += data.content;
                if (data.status === 'in_progress') {
                    textArea.classList.add('in-progress');
                }
                else if (data.status === 'completed') {
                    textArea.classList.remove('in-progress');
                }
            }
            else {
                const newElement = createElement("assistantNewDiv", data.content);
                if (data.status === 'in_progress') {
                    newElement.classList.add('in-progress');
                }
                responseElement.appendChild(newElement);
            }
        }
        isFirstResponse = false;
    };
    eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        eventSource.close();
        setElementDisplay(inputAndButton, "display");
    };
    eventSource.addEventListener('close', () => {
        eventSource.close();
        setElementDisplay(inputAndButton, "display");
    });
    emptyElement(userInput);
});
function emptyElement(element) {
    element.value = "";
}
function add(...numbers) {
    let sum = 0;
    for (const n of numbers) {
        sum += n;
    }
    return sum;
}
// console.log([add(), add(1, 2), add(100, 200, 300)])
function addition(...numbers) {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        const currentValue = numbers[i];
        sum += currentValue;
    }
    return sum;
}
console.log([addition(), add(1, 4), add(100, 200, 300)]);
