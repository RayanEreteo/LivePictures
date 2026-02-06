import io from "socket.io-client"

const socket = io("http://localhost:5000")

const channelIdText = document.getElementById("id-text") as HTMLHeadingElement
const channelID: string | null = localStorage.getItem("channelID")
const fileInput = document.getElementById("image-import-input") as HTMLInputElement
const img = document.getElementById("image") as HTMLImageElement

if (!channelID) {
    window.location.href = "/"
}

channelIdText.innerHTML = `Channel ID : ${channelID}`

fileInput.addEventListener('change', (event: Event) => {
    const target = event.target as HTMLInputElement;
    
    if (target.files && target.files[0]) {
        const file = target.files[0];

        const reader = new FileReader();

        reader.onload = (e) => {
            const imageUrl = e.target?.result;
            
            if (typeof imageUrl === 'string') {
                img.src = imageUrl;
            }
        };

        reader.readAsDataURL(file)
    }
});

window.onbeforeunload = () => {
    localStorage.clear()
}

socket.emit("enter-channel", channelID)