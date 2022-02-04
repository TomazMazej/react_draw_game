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
                <h1><a href="/">Draw Game</a></h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
			</nav>
            <div className={styles.profile_logo_container}>
                <div className={styles.profile_logo}>
                    {user && user.firstName && (
                    <div className={styles.profile_logo_text}>{user.firstName[0].concat(user.lastName[0])}</div>
                    )}
                </div>
            </div>
            <section className={styles.profile_info}>
                <h2>Email</h2>
                <h2>Games played</h2>
                <h2>Wins</h2>
                <h2>Points</h2>

                <p>{user.email}</p>
                <p>{user.gamesPlayed}</p>
                <p>{user.wins}</p>
                <p>{user.points}</p>
            </section>
        </div>
    )
}

export default Profile
