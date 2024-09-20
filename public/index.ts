const userInput = document.querySelector(".userInput") as HTMLInputElement;
const responseElement = document.querySelector(
  ".responseElement"
) as HTMLElement;
const btn = document.querySelector(".btn") as HTMLButtonElement;
const mainContainer = document.querySelector(".main-container") as HTMLElement;
const inputAndButton = document.querySelector(".inputAndButton") as HTMLElement



// Generate a random user ID (in a real app, this would be a proper user authentication system)
const userId = Math.random().toString(36).substring(7);

const processedIds = new Set<string>();

console.log(userInput);

interface ChatgptData {
  text: string;
  role: "user" | "assistant";
  id?: string;
}

interface ResponseData {
  message: Array<{
    role: string;
    content: Array<{
      text: {
        value: string;
      };
    }>;
    id: string;
  }>;
}

function createElement(classElement: string, textString: string) {
  let div = document.createElement("div");
  div.classList.add(classElement);
  div.textContent = textString;
  return div;
}

function appendElement(data: ChatgptData): void {
  if (responseElement instanceof HTMLElement) {
    data.role === "assistant"
      ? responseElement.appendChild(
          createElement("assistantNewDiv", data.text || "")
        )
      : userInput.value !== "" &&
        responseElement.appendChild(
          createElement("userNewDiv", userInput.value)
        );
  } else {
    console.error("Response element not found or is not an HTMLElement");
  }
}

function setElementDisplay(
  element: HTMLElement | HTMLInputElement,
  display: string
): void {
  if (element.classList.value === "displayNone" ) {
    element.classList.remove("displayNone")
    element.classList.add(display)
  } else if (element.classList.value !== "displayNone") {
    element.classList.remove("display")
    element.classList.add(display)

  }
}

btn.addEventListener("click", () => {
  if (userInput.value === "") {
    return alert("enter your question please");
  }

  setElementDisplay(inputAndButton, "displayNone");

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
    .then((response: Response) => {
      return response.status === 200 && response.ok
        ? response.json()
        : (() => {
            const throwError = (): never => {
              throw new Error("Something has gone wrong!");
            };
            return throwError();
          })(); ///In JavaScript, the ternary operator expects expressions on both sides of the colon. The throw statement is not an expression; it's a statement. Statements cannot be used where JavaScript expects an expression. Hence the immediately invoked function expression (IIFE)
    })
    .then((data: ResponseData) => {
      if (data.message) {
        console.log(data.message);
        for (let i = 0; i < data.message.length; i++) {
          let id: string = data.message[i].id;

          if (!processedIds.has(id)) {
            let text: string = data.message[i].content[0].text.value;
            let role: string = data.message[i].role;

            let messageObj: ChatgptData = {
              text: text,
              role: role as "user" | "assistant",
              id: id,
            };

            appendElement(messageObj);

            setElementDisplay(inputAndButton, "display");

            processedIds.add(id);
          }
        }
      }
    });

  emptyElement(userInput);
});

function emptyElement(element: HTMLInputElement): void {
  element.value = "";
}

