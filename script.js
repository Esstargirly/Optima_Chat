const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".msg-input");
const sendMessageBtn = document.querySelector("#send");

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
   }, 600)
}

messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && userMessage) {
        handleOutgoingMessage(e);
       // e.target.value = "";
    }
})

sendMessageBtn.addEventListener("click", (e) => handleOutgoingMessage (e))