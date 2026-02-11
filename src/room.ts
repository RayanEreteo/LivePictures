import io from "socket.io-client"

const socket = io("http://192.168.1.221:5000")

const imageForm = document.getElementById("image-form") as HTMLFormElement
const channelIdText = document.getElementById("id-text") as HTMLHeadingElement
const channelID: string | null = localStorage.getItem("channelID")
const fileInput = document.getElementById("image-import-input") as HTMLInputElement
const img = document.getElementById("image") as HTMLImageElement

const BUFFER_LIMIT: number = 5e+6 // 5MB buffer limit

if (!channelID) {
    window.location.href = "/"
}

channelIdText.innerHTML = `Channel ID : ${channelID}`

let binaryData: File | null = null

fileInput.addEventListener('change', (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]

        if (file.size > BUFFER_LIMIT) {
            alert("File too large!")
            target.value = ""
            return
        }

        binaryData = file

        const reader = new FileReader()
        reader.onload = (e) => {
            img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
    }
})

imageForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if (binaryData && channelID) {
        socket.emit("send-image", { channelID, image: binaryData })
    }
})

window.addEventListener("pagehide", () => {
    localStorage.clear()
})

socket.on("update-image", (imageData: ArrayBuffer) => {
    const blob = new Blob([imageData], { type: 'image/jpeg' })
    
    const url = URL.createObjectURL(blob)
    
    img.src = url
})

socket.emit("enter-channel", channelID)