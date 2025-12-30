import { createElement } from "react";

//create message element with dynamic classes and return it
const messageInput = document.querySelector("msg-input");
const createMessageElement = (content, classes) => {
    const div = document.createElement("div");
    div.classList.add("message", classes);
    div.innerHTML = content;
    return div;
}

const handleOutgoingMessage = (userMessage) => {
    const messageContent = `<div class="msg-text"> ${userMessage}</div>`;
   const outgoingMessageDiv = createMessageElement(messageContent, "user-msg")
}

messageInput.addEventListener("keydown", () => {
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && userMessage) {
        handleOutgoingMessage(userMessage);
    }
})