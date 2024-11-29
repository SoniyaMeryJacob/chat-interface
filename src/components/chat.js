import { useState } from 'react';
import styles from '../styles/Chat.module.css';

export default function SlidingChat() {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({ 1: [], 2: [], 3: [] });
  const [currentMessage, setCurrentMessage] = useState('');

  const openChat = (chatNumber) => {
    setActiveChat(chatNumber);  // Set active chat
  };

  const closeChat = () => {
    setActiveChat(null);  // Set active chat to null to close
  };

  const sendMessage = () => {
    if (currentMessage.trim() && activeChat) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [activeChat]: [
          ...prevMessages[activeChat],
          { text: currentMessage }, // Add the text message to the chat
        ],
      }));
      setCurrentMessage(''); // Clear the message input after sending
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
          // Assuming the API response includes fileUrl
          if (data.success && data.fileUrl) {
            setMessages((prevMessages) => ({
              ...prevMessages,
              [activeChat]: [
                ...prevMessages[activeChat],
                { fileName: data.fileUrl }, // Add the uploaded file URL to the messages state
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
    <div className={`${styles.container}`}>
      {/* Front Page with Chat Buttons */}
      {activeChat === null && (
        <div className={styles.chatButtons}>
          {[1, 2, 3].map((chat) => (
            <button
              key={chat}
              className={styles.chatButton}
              onClick={() => openChat(chat)} // Trigger openChat with chat number
            >
              CHAT {chat}
            </button>
          ))}
        </div>
      )}

      {/* Chat Panel */}
      {activeChat !== null && (
        <div className={`${styles.chatContainer} ${activeChat ? styles.open : ''}`}>
          <div className={styles.chatTag} onClick={closeChat}>
            CHAT {activeChat} <span className={styles.closeButton}></span>
          </div>

          <div className={styles.chatBox}>
            {messages[activeChat] && messages[activeChat].length > 0 ? (
              messages[activeChat].map((msg, idx) => (
                <div key={idx}>
                  {msg.text ? (
                    <div className={styles.message}>{msg.text}</div> // Text message
                  ) : (
                    <div>
                      <a
                        href={`/uploads/${msg.fileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.fileLink}
                      >
                        View Uploaded File
                      </a> // File message
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
        </div>
      )}
    </div>
  );
}
