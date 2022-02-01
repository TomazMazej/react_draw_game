import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"
import styles from "./styles.module.css";

const Chat = ({socket}) => {
    const [ state, setState ] = useState({ message: "", name: "" })
	const [ chat, setChat ] = useState([])
    state.name = localStorage.getItem("username");

	// Sprejmemo sporočio
	useEffect(
		() => {
			socket.on("message", ({ name, message }) => {
				setChat([ ...chat, { name, message } ])
			})
		},
		[ chat ]
	)

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = state
		// Pošljemo sporočilo
		socket.emit("message", { name, message })
		e.preventDefault()
		setState({ message: "", name })
	}

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
			</div>
		))
	}

	return (
		<div className={styles.card}>
			<form className={styles.chat_form} onSubmit={onMessageSubmit}>
				<h1 style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>Chat</h1>
				{renderChat()}
				<div>
					<TextField
						name="message"
						onChange={(e) => onTextChange(e)}
						value={state.message}
						id="outlined-multiline-static"
						variant="outlined"
						label="Message"
                        style={{ alignSelf: 'bottom'}}
					/>
                    <button className={styles.chat_button} type="submit">Send Message</button>
				</div>
			</form>	
		</div>
	)
};

export default Chat;