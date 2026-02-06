import io from "socket.io-client"

const socket = io("http://192.168.1.221:5000")

const imageForm = document.getElementById("image-form") as HTMLFormElement
const channelIdText = document.getElementById("id-text") as HTMLHeadingElement
const channelID: string | null = localStorage.getItem("channelID")
const fileInput = document.getElementById("image-import-input") as HTMLInputElement
const img = document.getElementById("image") as HTMLImageElement

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
                img.src = imgURL
            }
        };

        reader.readAsDataURL(file)
    }
});

imageForm.addEventListener("submit", (e) => {
    e.preventDefault()
    socket.emit("send-image", [channelID, imgURL])
})

window.onbeforeunload = () => {
    localStorage.clear()
}

socket.on("update-image", (imageURL) => {
    img.src = imageURL
})

socket.emit("enter-channel", channelID)