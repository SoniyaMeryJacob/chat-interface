import { useState } from 'react';
import styles from '../styles/Chat.module.css';

export default function SlidingChat() {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({ 1: [], 2: [], 3: [] });
  const [currentMessage, setCurrentMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false); // State for hamburger menu

  const openChat = (chatNumber) => {
    if (activeChat === chatNumber) {
      setActiveChat(null); // Close the chat if it's already open
    } else {
      setActiveChat(chatNumber);
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const sendMessage = () => {
    if (currentMessage.trim() && activeChat) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [activeChat]: [
          ...prevMessages[activeChat],
          { text: currentMessage },
        ],
      }));
      setCurrentMessage('');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.fileUrl) {
            setMessages((prevMessages) => ({
              ...prevMessages,
              [activeChat]: [
                ...prevMessages[activeChat],
                { fileName: data.fileUrl },
              ],
            }));
          }
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };

  return (
    <div className={styles.container}>
      {/* Hamburger Menu */}
      <div className={`${styles.hamburgerMenu} ${menuOpen ? styles.open : ''}`}>
        <button onClick={toggleMenu} className={styles.menuButton}>
          ☰
        </button>
        {menuOpen && (
          <div className={styles.chatTagsContainer}>
            {[1, 2, 3].map((chat) => (
              <div
                key={chat}
                className={styles.chatTag}
                onClick={() => openChat(chat)}
              >
                CHAT {chat}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Panels */}
      {[1, 2, 3].map((chat) => (
        <div
          key={chat}
          className={`${styles.chatContainer} ${activeChat === chat ? styles.open : ''}`}
        >
          {activeChat === chat && (
            <>
              <div className={styles.chatHeader}>
  <div className={styles.chatTag}>{`Welcome to Chat ${chat}`}</div>
  <button onClick={() => openChat(chat)} className={styles.closeButton}>
    ✖
  </button>
</div>

              <div className={styles.chatBox}>
                {messages[chat] && messages[chat].length > 0 ? (
                  messages[chat].map((msg, idx) => (
                    <div key={idx}>
                      {msg.text ? (
                        <div className={styles.message}>{msg.text}</div>
                      ) : (
                        <div>
                          <a
                            href={`/uploads/${msg.fileName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.fileLink}
                          >
                            View Uploaded File
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className={styles.noMessages}>No messages yet.</p>
                )}
              </div>

              <div className={styles.inputArea}>
                <input
                  type="text"
                  placeholder="Type a message"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className={styles.inputField}
                />
                <input
                  type="file"
                  className={styles.fileUpload}
                  onChange={handleFileUpload}
                />
                <button onClick={sendMessage} className={styles.sendButton}>
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
