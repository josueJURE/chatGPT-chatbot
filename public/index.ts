
const userInput = document.querySelector(".userInput") as HTMLInputElement;
const responseElement = document.querySelector(".responseElement") as HTMLElement;
const btn = document.querySelector(".btn") as HTMLButtonElement;
console.log(userInput, responseElement, btn);


btn.addEventListener("click", () => {
    fetch("/", {
   
        method : "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({input: userInput.value})
    })
    .then((response) =>  response.json())
    .then((data: { message: string, content: string, text: string} | void) => {
        if (data) {
            
            // responseElement.innerHTML = data.message[0].content[0].text.value /// do I need the return keyword?
            responseElement.innerHTML = data.message /// do I need the return keyword?
            console.log(data.message)
        }


        
    })

})

