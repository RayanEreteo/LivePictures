import io from "socket.io-client"

const socket = io("http://localhost:5000")

const form = document.getElementById("channel-form")
const formInput = document.getElementById("channel-id") as HTMLInputElement
const serverMsg = document.getElementById("server-message")

const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement

form?.addEventListener("submit", (e) => {
    e.preventDefault()
    submitBtn.disabled = true

    if (!socket.connected && serverMsg) {
        
        serverMsg.style.display = "block"
        serverMsg.innerHTML = "Server offline : please try again later"
        return
    }
    socket.emit("check-channel", formInput?.value)
})

socket.on("failure", (failureMsg) => {
    if (serverMsg) {
        serverMsg.style.display = "block"
        serverMsg.innerHTML = failureMsg
    }
    submitBtn.disabled = false
})

socket.on("success", () => {
    if (serverMsg) {
        serverMsg.style.display = "none"
    }
    localStorage.setItem("channelID", formInput.value)
    window.location.href = "/room"
})