import styles from "./styles.module.css";

export const Rooms = ( {rooms, onDelete} ) => {

    // Preusmeritev na sobo
    const onClick = (id) => {
        localStorage.setItem("roomId", id);
        window.location.href = `/room/${id}`;
    }

    return (
        <div>
            <h2>Rooms</h2>
            <div className={styles.todos}>
                {rooms.map(room => (
                    <div key={room._id}>
                        <div className={styles.todo} value={room._id} >
                            <div className={styles.text} onClick={() => onClick(room._id)}>{ room.name }</div>
                            <div className={styles.delete_todo} onClick={() => onDelete(room._id)}>x</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Rooms
