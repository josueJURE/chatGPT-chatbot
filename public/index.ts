
const userInput = document.querySelector(".userInput") as HTMLInputElement;
const responseElement = document.querySelector(".responseElement") as HTMLElement;
const btn = document.querySelector(".btn") as HTMLButtonElement;
console.log(userInput, responseElement, btn);


interface ResponseData {
    message: Array<{
      content: Array<{
        text: {
          value: string;
        };
      }>;
    }>;
  }
  


btn.addEventListener("click", () => {
    fetch("/", {
   
        method : "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({input: userInput.value})
    })
    .then((response) =>  response.json())
    .then((data: ResponseData) => {
        if (data.message) {
            for(let i = 0; i < data.message.length; i++) {
                buildElement(data.message[i].content[0].text.value);
            }
            

            console.log(typeof data.message)
        }


        
    })

    emptyElement(userInput);

})

function buildElement(text: string) {
    let newDiv = document.createElement("div");
    newDiv.classList.add("newDiv");
    let newContent = document.createTextNode(text);
    newDiv.appendChild(newContent);
    console.log(newContent);
    responseElement.appendChild(newDiv);
    
}


function emptyElement(element: HTMLInputElement) : void  {
    element.value = ""

}


// 1  why empyElement() not working: DONE
// 2 create a function for block of code within the for loop: DONE
// 3 get rid of any types: DONE
// 4 Api migth not remember context
// 5 Clean up code in server.js file
// 6 Udemy TS on interface

