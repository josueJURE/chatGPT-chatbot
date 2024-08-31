
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
    .then((data: { message: any, content: any, text: any}) => {
        if (data.message) {
            for(let i = 0; i < data.message.length; i++) {
                let newDiv = document.createElement("div");
                newDiv.classList.add("newDiv");
                let newContent = document.createTextNode(data.message[i].content[0].text.value);
                newDiv.appendChild(newContent);
                console.log(newContent);
                responseElement.appendChild(newDiv);
    
            }
                
            // responseElement.innerHTML = data.message[0].content[0].text.value /// do I need the return keyword?
           
            console.log(typeof data.message)
        }


        
    })

    emptyElement(userInput);

})


function emptyElement(element: HTMLInputElement) : void  {
    element.value = ""

}


// 1  why empyElement() not working
// 2 create a function for block of code within the for loop
// 3 get rid of any types
// 4 Api migth not remember context
// 5 Clean up code in server.js file
// 6 Udemy TS on interface

