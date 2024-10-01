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
    textContainer.setAttribute("disabled", "false");
    textContainer.classList.add(classElement);
    textContainer.value += textString;
    return textContainer;
}
function appendElement(data) {
    if (responseElement instanceof HTMLElement) {
        data.role === "assistant"
            ? responseElement.appendChild(createElement("assistantNewDiv", data.text || "saluto"))
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
    else
        setElementDisplay(inputAndButton, "displayNone");
    appendElement({ text: userInput.value, role: "user" });
    const eventSource = new EventSource(`/api?input=${encodeURIComponent(userInput.value)}&userId=${userId}`);
    // eventSource.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.content) {
    //     console.log(data.content)
    //   }
    // };
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.content) {
            console.log(data.content);
            // Find the last assistant message element
            const assistantElements = document.querySelectorAll('.assistantNewDiv');
            const lastAssistantElement = assistantElements[assistantElements.length - 1];
            if (lastAssistantElement) {
                // If it's the first message, replace the entire content
                if (lastAssistantElement.value === "generating text") {
                    lastAssistantElement.value += data.content;
                }
                else {
                    // Otherwise, append the new content
                    lastAssistantElement.value += data.content;
                }
            }
            else {
                // If no assistant element exists, create a new one
                appendElement({ text: data.content, role: "assistant" });
            }
        }
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
