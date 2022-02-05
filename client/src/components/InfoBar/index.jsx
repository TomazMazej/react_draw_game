import React from 'react';

import styles from "./styles.module.css";

const InfoBar = ({ room }) => (
  <div className={styles.infoBar}>
    <div className={styles.leftInnerContainer}>
      <h2>Room ID: {room}</h2>
    </div>
    <div className={styles.rightInnerContainer}>
      <a className={styles.black_btn} href="/">Leave</a>
    </div>
  </div>
);

export default InfoBar;