import {apiKey} from "./config.js";

const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".msg-input");
const sendMessageBtn = document.querySelector("#send");
const chatForm = document.querySelector(".chat-form");
const fileInput = document.querySelector("#file-input")

const API_URL = "https://api.mistral.ai/v1/chat/completions";

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
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

   const content = [
    {type: "text", text: userData.message}
   ];

   if (userData.file.data) {
    content.push ({
        type: "image_url",
        image_url: {
            url: `data:${userData.file.mime_type};base64,${userData.file.data}`
        }
    });
   }

    const requestOptions = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "mistral-small-latest",
            messages:[
                { role: "user", 
                    content
                }
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
        const apiResponseText = data.choices[0].message.content.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerHTML = apiResponseText;
       // console.log(data);

    } catch (error){
       console.log(error);
       messageElement.innerText = error.message;
       messageElement.style.color = "ff0000";
       //messageElement.textContent = "Error getting response";
    } finally{
        incomingMessageDiv.classList.remove("think");
        chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});
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
   chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});

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
    chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});
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

//handle file input change
fileInput.addEventListener("change", () =>{
    const file =fileInput.files[0];
    if (!file) return;

    //console.log(file);
    const reader = new FileReader();
    reader.onload = (e) => {
        const based64String = e.target.result.split(",") [1];

        //store file data in userdata
        userData.file =  {
            data: based64String,
            mime_type: file.type
        }
        //console.log(userData);
        fileInput.value = "";
    }

    reader.readAsDataURL(file);
})

document.querySelector("#file").addEventListener("click", () => fileInput.click())
