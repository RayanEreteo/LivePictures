// Initialize Socket.IO client connection to the server
import io from "socket.io-client"
const socket = io("https://livepictures-server.onrender.com")

// Get DOM elements
const imageForm = document.getElementById("image-form") as HTMLFormElement
const channelIdText = document.getElementById("id-text") as HTMLHeadingElement
const channelID: string | null = localStorage.getItem("channelID")
const fileInput = document.getElementById("image-import-input") as HTMLInputElement
const img = document.getElementById("image") as HTMLImageElement

// 5MB buffer limit 
const BUFFER_LIMIT: number = 5e+6

// Redirect to index if not channelID in localstorage
if (!channelID) {
    window.location.href = "/"
}

// Update channelID UI to show the user which room is he currently in
channelIdText.innerHTML = `Channel ID : ${channelID}`

// Store the selected image file
let binaryData: File | null = null

// Handle image file selection
fileInput.addEventListener('change', (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]

        // Validate file size against buffer limit
        if (file.size > BUFFER_LIMIT) {
            alert("File too large!")
            target.value = ""
            return
        }

        // Store file reference for later submission
        binaryData = file

        // Preview the selected image
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            img.src = e.target?.result as string
        }
    }
})

// Handle image form submission
imageForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if (binaryData && channelID) {
        // Emit image to server with channel ID
        socket.emit("send-image", { channelID, image: binaryData })
    }
})

// Clear local storage when user leaves the page
window.addEventListener("pagehide", () => {
    localStorage.clear()
})

// Listen for image updates from other users in the channel
socket.on("update-image", (imageData: ArrayBuffer) => {
    // Convert buffer to blob and display image
    const blob = new Blob([imageData], { type: 'image/jpeg' })
    const url = URL.createObjectURL(blob)
    img.src = url
})

// Notify server that this user has entered the channel
socket.emit("enter-channel", channelID)