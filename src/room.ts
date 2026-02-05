import io from "socket.io-client"

const socket = io("http://localhost:5000")
const channelIdText = document.getElementById("id-text") as HTMLHeadingElement
const channelID: string | null = localStorage.getItem("channelID")

if (!channelID) {
    window.location.href = "/"
}

channelIdText.innerHTML = `Channel ID : ${channelID}`

window.onbeforeunload = () => {
    localStorage.clear()
}