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
    //const [master, setMaster] = useState('');

    var name = localStorage.getItem("username");
    var room = localStorage.getItem("roomId");    
    var playerCounter = 0;
    const words = ["Car", "Tree", "Gladiator", "Phone"];

    var p = [];

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
            // Zberemo uporabnika, ki začne, ostale dodamo v seznam
            p = [];
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
            setStartGame(true);
        });
    },[])

    // Naslednji igralec
    useEffect( () =>  {
        socket.on("next", ({}) => {
            playerTurn();
        });
    },[])

    // Konec igre
    useEffect( () =>  {
        socket.on("end", ({}) => {
            setStartGame(false);
            window.location.reload(false);
        });
    },[])

    // Sprejmemo ugibanja
	useEffect( () => {
		socket.on("message", ({ name, message }) => {
            var word = localStorage.getItem("word");
            var m = localStorage.getItem("master");
            var n = localStorage.getItem("username");
            if(message === word){
                socket.emit("message", { name: 'admin', message: `${name} guessed the word!` })
                playerCounter+=1;
                if(m === n){ // Master skrbi za potek igre
                    if(playerCounter === p.length){
                        socket.emit("end", { master: p[0] }); 
                    } else{
                        playerTurn();
                    }
                }
            }
		})
	},[])

    const playerTurn = () => {
        var player = p[playerCounter];
        // Izberemo naključno besedo iz nabora
        var word = words[Math.floor(Math.random() * words.length)];
        localStorage.setItem("word", word);
        socket.emit("message", { name: 'admin', message: `${player.name} draws.` })
        socket.emit("turn", { word, user: player });  
    }

    // Potek igre
    const handleStartGame = ()=> {
        // Tisti, ki je začel igro
        var masterUser; 
        users.forEach(function (item, index) {
            if(item.name === name){
                masterUser = item;
            }
        });
        localStorage.setItem("master", masterUser.name);
        socket.emit("start", { master: masterUser }); 
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
