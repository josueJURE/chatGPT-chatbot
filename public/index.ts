
const userInput = document.querySelector(".userInput") as HTMLInputElement;
const responseElement = document.querySelector(".responseElement") as HTMLElement;
const btn = document.querySelector(".btn") as HTMLButtonElement;
const mainContainer = document.querySelector(".main-container") as HTMLElement;
const inputAndButton = document.querySelector(".inputAndButton") as HTMLElement;

// Generate a random user ID (in a real app, this would be a proper user authentication system)
const userId = Math.random().toString(36).substring(7);

interface ChatgptData {
  text?: string;
  role: "user" | "assistant";
  id?: string;
}

function createElement(classElement: string, textString: string) {
  let textContainer = document.createElement("textarea");
  textContainer.setAttribute("disabled", "true");
  textContainer.classList.add(classElement);
  textContainer.value  += textString;
  return textContainer;
}

function appendElement(data: ChatgptData): void {
  if (responseElement instanceof HTMLElement) {
    data.role === "assistant"
      ? responseElement.appendChild(createElement("assistantNewDiv", "generating recipe"))
      : userInput.value !== "" && responseElement.appendChild(createElement("userNewDiv", userInput.value));
  } else {
    console.error("Response element not found or is not an HTMLElement");
  }
}

function setElementDisplay(element: HTMLElement | HTMLInputElement, display: string): void {
  element.classList.remove("displayNone", "display");
  element.classList.add(display);
}

btn.addEventListener("click", () => {
  if (userInput.value === "") {
    return alert("enter your question please");
  } 

  setElementDisplay(inputAndButton, "displayNone");
  appendElement({ text: userInput.value, role: "user" });
  appendElement({role: "assistant"})

  


  const eventSource = new EventSource(`/api?input=${encodeURIComponent(userInput.value)}&userId=${userId}`);




  let isFirstResponse: boolean = true;
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.content) {
      if (responseElement.lastChild instanceof HTMLElement && responseElement.lastChild.classList.contains('assistantNewDiv')) {
        const textArea = responseElement.lastChild as HTMLTextAreaElement;
        
      if(isFirstResponse) {
          textArea.value = ""

      }
        
        
        textArea.value += data.content;
        if (data.status === 'in_progress') {
          textArea.classList.add('in-progress');
        } else if (data.status === 'completed') {
          textArea.classList.remove('in-progress');
        }
      } else {
        const newElement = createElement("assistantNewDiv", data.content);
        if (data.status === 'in_progress') {
          newElement.classList.add('in-progress');
        }
        responseElement.appendChild(newElement);
      }
    }
    isFirstResponse = false 


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

function emptyElement(element: HTMLInputElement): void {
  element.value = "";
}





