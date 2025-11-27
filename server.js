const express = require("express");
const mqtt = require("mqtt");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Arquivos de frontend na pasta public
app.use(express.static("public"));

//Conexão com broker
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

// Quando conectar ao broker
client.on("connect", () => {
    console.log("Conectado ao broker MQTT");
    client.subscribe("casadoerik/lampada/status");
    io.emit("mqtt_status","Conectado");
});

client.on("offline", () => {
    console.warn("Cliente MQTT Offline");
    io.emit("mqtt_status", "Desconectado")
});

client.on("error", (err) => {
    console.error("Erro MQTT:", err.message);
    io.emit("mqtt_status","Reconectando");
});

// Receber mensagem do MQTT
client.on("message", (topic, message) =>{
    console.log(`[${topic}] ${message.toString()}`);
    io.emit("lampada_status", message.toString());
});

// Comunicar com o navegador via socket.io
io.on("connection", (socket) => {
    console.log("Novo cliente conectado");
    io.emit("mqtt_status","Conectado");

    socket.on("ligar_lampada", () => {
        client.publish("casadoerik/lampada/controle", "ON");
        console.log("ligar Lamp");
    });

    socket.on("desligar_lampada", () => {
        client.publish("casadoerik/lampada/controle", "OFF");
        console.log("desligar Lamp");
    });
});

// Subir o servidor na porta 3000
server.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});