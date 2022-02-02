import React, { useEffect, useRef, useState } from "react"
import InfoBar from '../InfoBar'
import Chat from '../Chat'
import Canvas from '../Canvas'
import TextContainer from '../TextContainer'
import { socketID, socket } from '../../socket';

import styles from "./styles.module.css";

const Room = () => {

    const [users, setUsers] = useState('');
    const [players, setPlayers] = useState('');
    const [startGame, setStartGame] = useState(false);

    var name = localStorage.getItem("username");
    var room = localStorage.getItem("roomId");    
    var playerCounter = 0;
    const words = ["Car", "Tree", "Gladiator", "Phone"];

    // Pridružitev
    useEffect( () => {
        socket.emit('join', {name, room}, (error) => {
            if(error) {
                alert(error);
            }
        });
		return () => {
            socket.emit('disconnect');
            socket.off(); 
        }
	}, [])

    // Uporabniki v sobi
    useEffect( () =>  {
        socket.on("roomData", ({ users }) => {
            setUsers(users);
            console.log(`Uporabniki ${users}`);
            var p = [];
            // Zberemo uporabnika, ki začne, ostale dodamo v seznam
            var user = users[Math.floor(Math.random() * users.length)];
            p.push(user);
            users.forEach(function (item, index) {
                if(item.id !== user.id){
                    p.push(item);
                }
            });
            setPlayers(p);
        });
    },[])

    // Začetek igre
    useEffect( () =>  {
        socket.on("start", ({}) => {
            console.log("neki")
            setStartGame(true);
        });
    },[])

    // Sprejmemo ugibanja
	useEffect( () => {
		socket.on("message", ({ name, message }) => {
            var word = localStorage.getItem("word");
            if(message === word){
                socket.emit("message", { name: 'admin', message: `${name} guessed the word!` })
                playerCounter+=1;
                playerTurn();
            }
		})
	},[])

    const playerTurn = () => {
        var player = players[playerCounter];
        console.log(`PLayer counter: ${playerCounter}`);
        console.log(`players: ${players}`)
        console.log(`player: ${player}`)
        // Izberemo naključno besedo iz nabora
        var word = words[Math.floor(Math.random() * words.length)];
        localStorage.setItem("word", word);
        socket.emit("message", { name: 'admin', message: `${player.name} draws.` })
        socket.emit("turn", { word, user: player });  
    }

    // Potek igre
    const handleStartGame = ()=> {
        socket.emit("start", { user: players[0]}); 
        playerTurn();
	};

	return (
		<div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Chat socket={socket}/>
                <TextContainer users={users}/>
            </div>
            {users.length >= 2 && !startGame? (
                <button type="button" className={styles.black_btn} onClick={handleStartGame}>Start Game</button>
              ) : ''}
            {startGame ? (
                <Canvas socket={socket}/>
              ) : ''}
        </div>
	);
};

export default Room;
