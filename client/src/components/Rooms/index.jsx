import styles from "./styles.module.css";
import { fadeInLeft, bounce } from 'react-animations'
import styled, { keyframes } from 'styled-components';

export const Rooms = ({ rooms, onDelete }) => {

    const fadeInLeftAnimation = keyframes`${fadeInLeft}`;
    const FadeInDiv = styled.div`animation: 1s ${fadeInLeftAnimation};`;

    // Preusmeritev na sobo
    const onClick = (id) => {
        localStorage.setItem("roomId", id);
        window.location.href = `/room/${id}`;
    }

    return (
        <div>
            <h2>Game rooms</h2>
            <div className={styles.todos}>
                {rooms.map(room => (
                    <FadeInDiv key={room._id}>
                        <div className={styles.todo} value={room._id} >
                            <div className={styles.text} onClick={() => onClick(room._id)}>{room.name}</div>
                            <div className={styles.delete_todo} onClick={() => onDelete(room._id)}>x</div>
                        </div>
                    </FadeInDiv>
                ))}
            </div>
        </div>
    )
}

export default Rooms
