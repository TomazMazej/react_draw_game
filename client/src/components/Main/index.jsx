import { useState, useEffect} from 'react';
import styles from "./styles.module.css";
import Canvas from '../Canvas'

const Main = () => {
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

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>Draw Game</h1>
				<h1>{ user.firstName }</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
			</nav>
			<Canvas/>
		</div>
	);
};

export default Main;
