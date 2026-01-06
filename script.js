import {apiKey} from "./config.js";

const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".msg-input");
const sendMessageBtn = document.querySelector("#send");
const chatForm = document.querySelector(".chat-form");
const fileInput = document.querySelector("#file-input");
const fileUpload = document.querySelector(".file-upload");
const fileCancelBtn = document.querySelector("#file-cancel")

const API_URL = "https://api.mistral.ai/v1/chat/completions";

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
}
const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

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

   //save user message
   chatHistory.push({
    role: "user",
    content: content
   });

    const requestOptions = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "mistral-small-latest",
            messages: chatHistory
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

       //save bot response
       chatHistory.push({
        role: "assistant",
        content: content
       });

    } catch (error){
        //handle api response error
       console.log(error);
       messageElement.innerText = error.message;
       messageElement.style.color = "ff0000";
       //messageElement.textContent = "Error getting response";
    } finally{
        userData.file = {};
        incomingMessageDiv.classList.remove("think");
        chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});
    }
}

//handle user outgoing message
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim(); 
    messageInput.value = "";
    fileUpload.classList.remove("file-uploaded");
    messageInput.dispatchEvent(new Event ("input"));

    //create and display user message
    const messageContent = `<div class="msg-text"></div>
                                    ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64, ${userData.file.data}" class="attachment"/>`: ""}`;
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

//handle enter key press for sending messages
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (!userData.message) return;
    if (e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768) {
        handleOutgoingMessage(e);
       // e.target.value = "";
    }
});

//adjust input height when it's big
messageInput.addEventListener("input", () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > 
    initialInputHeight ? "15px" : "32px";
});


//handle file input change and preview
fileInput.addEventListener("change", () =>{
    const file =fileInput.files[0];
    if (!file) return;

    //console.log(file);
    const reader = new FileReader();
    reader.onload = (e) => {
        fileUpload.querySelector("img").src = e.target.result;
        fileUpload.classList.add("file-uploaded")
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
});

//cancel file upload
fileCancelBtn.addEventListener("click", () => {
    userData.file = {};
    fileUpload.classList.remove("file-uploaded")
});

//initalizing emoji picker and selection
const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        const {selectionStart: start, selectionEnd: end} = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
    },
    onClickOutside: (e) => {
        if (e.target.id === "emoji-picker") {
            document.body.classList.toggle("show-emoji-picker");
        } else{
            document.body.classList.remove("show-emoji-picker");
        }
    }
});
    document.querySelector(".chat-form").appendChild(picker);

//sendMessageBtn.addEventListener("submit", (e) => handleOutgoingMessage (e));
chatForm.addEventListener("submit", (e) => {
    handleOutgoingMessage(e);
} );
document.querySelector("#file").addEventListener("click", () => fileInput.click())
