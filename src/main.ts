// Initialize Socket.IO client connection to the server
import io from "socket.io-client"
const socket = io(import.meta.env.VITE_URL_BACKEND)

// Get DOM elements
const form = document.getElementById("channel-form")
const formInput = document.getElementById("channel-id") as HTMLInputElement
const serverMsg = document.getElementById("server-message")
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement

socket.on("connect", () => {
    submitBtn.disabled = false
})

// Handle form submission to check if channel exists
form?.addEventListener("submit", (e) => {
    e.preventDefault()
    submitBtn.disabled = true
    // Verify server connection before emitting
    if (!socket.connected && serverMsg) {
        submitBtn.disabled = false
        serverMsg.style.display = "block"
        serverMsg.innerHTML = "Server offline : please try again later"
        return
    }

    // Emit channel ID to server for validation
    socket.emit("check-channel", formInput?.value)
})

// Handle server validation failure response
socket.on("failure", (failureMsg) => {
    if (serverMsg) {
        serverMsg.style.display = "block"
        serverMsg.innerHTML = failureMsg
    }
    submitBtn.disabled = false
})

// Handle server validation success response
socket.on("success", () => {
    if (serverMsg) {
        serverMsg.style.display = "none"
    }
    // Store channel ID in local storage and navigate to room
    localStorage.setItem("channelID", formInput.value)
    window.location.href = "/room.html"
})