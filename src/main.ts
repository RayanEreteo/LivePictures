import io from "socket.io-client"

const socket = io("http://localhost:5000")

const form = document.getElementById("channel-form")
const formInput = document.getElementById("channel-id") as HTMLInputElement

form?.addEventListener("submit", (e) => {
    e.preventDefault()
    socket.emit("join-channel", formInput?.value)
})

socket.on("failure", (failureMsg) => {
    console.log(failureMsg)
})