import React from 'react';
 
import styles from "./styles.module.css";
 
const InfoBar = ({ room }) => (
  <div className={styles.infoBar}>
    <div className={styles.leftInnerContainer}>
      <h3>Room ID: {room}</h3>
    </div>
    <div className={styles.rightInnerContainer}>
      <a href="/">Leave</a>
    </div>
  </div>
);
 
export default InfoBar;