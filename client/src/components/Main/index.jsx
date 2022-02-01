import { useState, useEffect} from 'react';
import styles from "./styles.module.css";
import Rooms from '../Rooms'

const Main = () => {
	// Nav
	const [user, setUser] = useState("");
	const email = localStorage.getItem("email");

	useEffect(() => {
		GetUser();
	  }, [])

	const GetUser = () => {
		fetch("http://localhost:8080/users/" + email)
		  .then(res => res.json())
		  .then(data => setUser(data))
		  .then(err => console.error("Error: ", err));
	}

	localStorage.setItem("username", user.firstName);

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	// Sobe
	const [rooms, setRooms] = useState([]);
	const [addRoomActive, setAddRoomActive] = useState(false);
	const [newRoom, setNewRoom] = useState("");

	useEffect(() => {
		GetRooms();
	  }, [])

	const GetRooms = () => {
		fetch("http://localhost:8080/rooms")
		  .then(res => res.json())
		  .then(data => setRooms(data))
		  .then(err => console.error("Error: ", err));
	}

	const addRoom = async () => {
		const data = await fetch("http://localhost:8080/room/new/", {
		  method : "POST",
		  headers: {
			"Content-Type": "application/json"
		  },
		  body: JSON.stringify({name: newRoom})
		}).then(res => res.json());
	
		setRooms([...rooms, data]);
		setAddRoomActive(false);
		setNewRoom("");
	  }
	
	const deleteRoom = async id => {
		const data = await fetch("http://localhost:8080/room/delete/" + id, {
		  method : "DELETE"
		}).then(res => res.json());
	
		setRooms(rooms => rooms.filter(room => room._id !== data._id));
	}

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>Draw Game</h1>
				<h1>{ user.firstName }</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
			</nav>

			<Rooms rooms={rooms}
                   onDelete={deleteRoom}/>
            <div className={styles.addPopup} onClick={() => setAddRoomActive(true)}>+</div>

            {/*Dodajanje sobe*/}
            {addRoomActive ? (
              <div className={styles.popup}>
                <div className={styles.closePopup} onClick={() => setAddRoomActive(false)}>x</div>
                <div className={styles.content}>
                  <h3>Add Room</h3>
                  <input 
                    type="text" 
                    className={styles.add_todo_input} 
                    onChange={e => setNewRoom(e.target.value)} 
                    value={newRoom} 
                    placeholder="Name"/>
                  <div className={styles.add_button} onClick={addRoom}>Create Room</div>
                  </div>
              </div>
            ) : ''}
		</div>
	);
};

export default Main;
