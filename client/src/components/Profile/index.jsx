import { useState, useEffect} from 'react';
import styles from "./styles.module.css";

export const Profile = ( {} ) => {

    var email = localStorage.getItem("email");

    const [user, setUser] = useState('');

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
        <div>
            <nav className={styles.navbar}>
				<h1>Draw Game</h1>
				<h1>{ user.firstName }</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
			</nav>
            <h2>Name: {user.firstName} {user.lastName}</h2>
            <h2>Email: {user.email}</h2>
            <h2>Games played: {user.gamesPlayed}</h2>
            <h2>Wins: {user.wins}</h2>
            <h2>Points: {user.points}</h2>
        </div>
    )
}

export default Profile
