import io from "socket.io-client"

const socket = io("http://localhost:5000")

socket.on("connect", () => {
    console.log("connecté au serveur");

    const text = "This is a test"
    socket.emit("message", text)
})

socket.on("message", text => {
    console.log("reçu :", text)
})
