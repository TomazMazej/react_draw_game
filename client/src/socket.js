
import { io } from 'socket.io-client';

var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity",
    "timeout" : 10000,                 
    "transports" : ["websocket"]
};

export const socket = io.connect("http://localhost:8080", connectionOptions)
export let socketID = '';
socket.on('connection', () => {
    socketID = socket.id
})