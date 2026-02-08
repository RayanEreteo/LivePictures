// TODO : Add error message for buffer limit or server fail (need size checking to backend).
//! BUGS : Sometimes the image is not send for unknown reason.

import io from "socket.io-client"

const socket = io("http://192.168.1.221:5000")

const imageForm = document.getElementById("image-form") as HTMLFormElement
const channelIdText = document.getElementById("id-text") as HTMLHeadingElement
const channelID: string | null = localStorage.getItem("channelID")
const fileInput = document.getElementById("image-import-input") as HTMLInputElement
const img = document.getElementById("image") as HTMLImageElement

const BUFFER_LIMIT: number = 5e+6 // 5MB buffer limit

let imgURL: string | ArrayBuffer | undefined | null = ""

if (!channelID) {
    window.location.href = "/"
}

channelIdText.innerHTML = `Channel ID : ${channelID}`

fileInput.addEventListener('change', (event: Event) => {
    const target = event.target as HTMLInputElement
    
    if (target.files && target.files[0]) {
        const file = target.files[0]

        const reader = new FileReader()

        reader.onload = (e) => {
            imgURL = e.target?.result
            
            if (typeof imgURL === 'string') {
                if (file.size > BUFFER_LIMIT) {
                    target.value = ""
                    return
                }
                img.src = imgURL
            }
        }

        reader.readAsDataURL(file)
    }
});

imageForm.addEventListener("submit", (e) => {
    e.preventDefault()
    socket.emit("send-image", [channelID, imgURL])
})

window.addEventListener("pagehide", () => {
    localStorage.clear()
})

socket.on("update-image", (imageURL) => {
    img.src = imageURL
})

socket.emit("enter-channel", channelID)