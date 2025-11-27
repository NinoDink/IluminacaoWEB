const socket = io();

function ligar(classe){
    socket.emit("ligar_lampada");
    document.querySelector(`.${classe}`).classList.add("aguardando");
}

function desligar(classe){
    socket.emit("desligar_lampada");
    document.querySelector(`.${classe}`).classList.add("aguardando");
}

// Recebe status da lampada
socket.on("lampada_status", (msg) => {
    console.log(msg.toString());
    const lampada = document.getElementById("lampada");
    if (msg === "ON") {
        lampada.classList.add("ligada");
        lampada.classList.remove("aguardando");
    } else if (msg === "OFF") {
        lampada.classList.remove("ligada");
        lampada.classList.remove("aguardando");
    } else {
        console.log("Estado não reconhecido!");
    }
});

// Recebe status do servidor mqtt
socket.on("mqtt_status", (status) => {
    console.log(status);
    const mqttStatusDiv = document.getElementById("mqtt-status");
    mqttStatusDiv.innerText = "MQTT: " + status;
    mqttStatusDiv.className = "";

    if (status === "Conectado") {
        mqttStatusDiv.classList.add("status-conectado");
    } else if (status === "Desconectado") {
        mqttStatusDiv.classList.add("status-desconectado");
    } else {
        mqttStatusDiv.classList.add("status-reconectando");
    }
});