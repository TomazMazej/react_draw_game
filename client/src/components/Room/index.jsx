import React, { useEffect, useRef, useState } from "react"
import InfoBar from '../InfoBar'
import Chat from '../Chat'
import TextContainer from '../TextContainer'
import { socketID, socket } from '../../socket';

const Room = () => {

    const [users, setUsers] = useState('');

    var name = localStorage.getItem("username");
    var room = localStorage.getItem("roomId");

    useEffect( () => {

        socket.emit('join', {name, room}, (error) => {
                if(error) {
                    alert(error);
                }
            })
			return () => {
                socket.emit('disconnect');
                socket.off(); 
            }
		}, []
	)

    useEffect( () =>  {
        socket.on("roomData", ({ users }) => {
            setUsers(users);
            console.log(users);
        });
    },[])

	return (
		<div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Chat socket={socket}/>
                <TextContainer users={users}/>
            </div>
        </div>
	);
};

export default Room;
