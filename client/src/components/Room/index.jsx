import React, { useEffect, useRef, useState } from "react"
import InfoBar from '../InfoBar'
import Chat from '../Chat'
import Canvas from '../Canvas'
import TextContainer from '../TextContainer'
import { socketID, socket } from '../../socket';
import song from "../../win.mp3";

import styles from "./styles.module.css";

const Room = () => {

    const [users, setUsers] = useState('');
    const [startGame, setStartGame] = useState(false);

    var name = localStorage.getItem("username");
    var room = localStorage.getItem("roomId");
    var email = localStorage.getItem("email");
    var playerCounter = 0;
    var audio = new Audio(song);

    var players = [];
    const words = ["Car", "Tree", "Gladiator", "Phone", "Computer", "Sword", "Coffee"];

    // Pridružitev
    useEffect(() => {
        socket.emit('join', { name, email, room }, (error) => {
            if (error) {
                alert(error);
            }
        });
        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [])

    // Uporabniki v sobi
    useEffect(() => {
        socket.on("roomData", ({ users }) => {
            setUsers(users);
            console.log(`Uporabniki ${users}`);
            // Zberemo uporabnika, ki začne, ostale dodamo v seznam
            players = [];
            var user = users[Math.floor(Math.random() * users.length)];
            players.push(user);
            users.forEach(function (item, index) {
                if (item.id !== user.id) {
                    players.push(item);
                }
            });
        });
    }, [])

    // Začetek igre
    useEffect(() => {
        socket.on("start", ({ }) => {
            setStartGame(true);
            incrementGamesPlayed();
        });
    }, [])

    // Naslednji igralec
    useEffect(() => {
        socket.on("next", ({ }) => {
            playerTurn();
        });
    }, [])

    // Konec igre
    useEffect(() => {
        socket.on("end", ({ }) => {
            setStartGame(false);
            window.location.reload(false);
        });
    }, [])

    // Sprejmemo ugibanja
    useEffect(() => {
        socket.on("message", ({ name, message }) => {
            var word = localStorage.getItem("word");
            var m = localStorage.getItem("master");
            var n = localStorage.getItem("username");
            if (message === word) {
                incrementWins(name);
                playerCounter += 1;
                if (m === n) { // Master skrbi za potek igre
                    audio.play();
                    socket.emit("message", { name: 'admin', message: `${name} guessed the word!` })
                    if (playerCounter === players.length) {
                        socket.emit("message", { name: 'admin', message: `The game is over!` })
                        setTimeout(() => { socket.emit("end", { master: players[0] }); }, 5000);
                    } else {
                        playerTurn();
                    }
                }
            }
        })
    }, [])

    const playerTurn = () => {
        var player = players[playerCounter];
        // Izberemo naključno besedo iz nabora
        var word = words[Math.floor(Math.random() * words.length)];
        localStorage.setItem("word", word);
        socket.emit("message", { name: 'admin', message: `${player.name} draws.` })
        socket.emit("turn", { word, user: player });
    }

    // Potek igre
    const handleStartGame = () => {
        // Tisti, ki je začel igro
        var masterUser;
        users.forEach(function (item, index) {
            if (item.name === name) {
                masterUser = item;
            }
        });
        localStorage.setItem("master", masterUser.name);
        socket.emit("start", { master: masterUser });
    };

    const incrementGamesPlayed = () => {
        fetch("http://localhost:8080/incgames/" + email, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        }).then(res => res.json());
    }

    const incrementWins = (n) => {
        fetch("http://localhost:8080/incwins/" + n, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        }).then(res => res.json());
    }

    const incrementPoints = () => {
        fetch("http://localhost:8080/incgames/" + email, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        }).then(res => res.json());
    }

    return (
        <div>
            <InfoBar room={room} />
            <div>
                <section className={styles.table}>
                    <div className={styles.chat_container}>
                        <Chat socket={socket} />
                    </div>
                    <Canvas socket={socket} />
                    <div>
                        <TextContainer users={users} />
                        {users.length >= 2 && users.length < 8 && !startGame ? (
                            <button style={{ alignSelf: 'bottom', width: '100%' }} className={styles.start_button} onClick={handleStartGame}>Start Game</button>
                        ) :
                            <button style={{ alignSelf: 'bottom', width: '100%' }} className={styles.start_button}>Waiting for players</button>}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Room;
