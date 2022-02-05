import React from 'react';
import styles from "./styles.module.css";

const TextContainer = ({ users }) => (
  <div className={styles.chat_form}>
    {
      users
        ? (
          <div>
            <h1>People in room:</h1>
            <div >
              <h2>
                {users.map(({ name }) => (
                  <div key={name} className={styles.activeItem}>
                    {name}
                  </div>
                ))}
              </h2>
            </div>
          </div>
        )
        : null
    }
  </div>
);

export default TextContainer;