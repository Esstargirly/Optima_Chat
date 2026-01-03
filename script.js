import {apiKey} from "./config.js";

const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".msg-input");
const sendMessageBtn = document.querySelector("#send");
const chatForm = document.querySelector(".chat-form")

const API_URL = "https://api.mistral.ai/v1/chat/completions";

const userData = {
    message: null
}

//create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

//Generate bot response using APi
const generateBotResponse = async(incomingMessageDiv) => {
   const messageElement = incomingMessageDiv.querySelector(".msg-text");

    const requestOptions = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "mistral-small-latest",
            messages:[
                { role: "user", content: userData.message}
            ]
        })
    };

    try{
        //fetch bot reponse from Api
        const response = await fetch (API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) 
            throw new Error (data.error.message);

        //extracting and displaying bot response
        const apiResponseText = data.choices[0].message.content.trim();
        messageElement.innerHTML = apiResponseText;
       // console.log(data);

    } catch (error){
       console.log(error);
       messageElement.textContent = "Error getting response";
    }
}

//handle user outgoing message
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim(); 
    messageInput.value = "";

    const messageContent = `<div class="msg-text"></div>`;
   const outgoingMessageDiv = createMessageElement(messageContent, "user-msg");
   outgoingMessageDiv.querySelector(".msg-text").textContent = userData.message;
   chatBody.appendChild(outgoingMessageDiv);

   //simulate bot response with thinking indicator
   setTimeout (() => {
    const messageContent = `<img src="./chatimage.png" class="avatar" alt="" width="50px" height="50px">
                <div class="msg-text">
                    <div class="thinking">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;

    const incomingMessageDiv = createMessageElement(messageContent, "bot-msg", "think");
    chatBody.appendChild(incomingMessageDiv);
    generateBotResponse(incomingMessageDiv);
   }, 600)
}

messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (!userData.message) return;
    if (e.key === "Enter" && userMessage) {
        handleOutgoingMessage(e);
       // e.target.value = "";
    }
})

//sendMessageBtn.addEventListener("submit", (e) => handleOutgoingMessage (e));
chatForm.addEventListener("submit", (e) => {
    handleOutgoingMessage(e);
} );
