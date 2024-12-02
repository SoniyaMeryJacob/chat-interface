import { useState } from 'react';
import styles from '../styles/Chat.module.css';

export default function SlidingChat() {
  const [activeChat, setActiveChat] = useState(null);  // Track the active chat
  const [messages, setMessages] = useState({ 1: [], 2: [], 3: [] });
  const [currentMessage, setCurrentMessage] = useState('');

  // Function to open a specific chat tab and close others
  const openChat = (chatNumber) => {
    setActiveChat(chatNumber); // Set the active chat tab
  };

  // Function to close the active chat tab
  const closeChat = () => {
    setActiveChat(null); // Close the active chat tab
  };

  // Function to send a text message
  const sendMessage = () => {
    if (currentMessage.trim() && activeChat) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [activeChat]: [
          ...prevMessages[activeChat],
          { text: currentMessage }, // Add the text message to the active chat
        ],
      }));
      setCurrentMessage(''); // Clear the message input after sending
    }
  };

  // Handle file uploads
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
    <div className={styles.container}>
      {/* Persistent Chat Tags */}
      <div className={styles.chatTags}>
        {[1, 2, 3].map((chat) => (
          <div
            key={chat}
            className={styles.chatTag}
            onClick={() => openChat(chat)} // Opens the respective chat
          >
            CHAT {chat}
          </div>
        ))}
      </div>

      {/* Chat Panels */}
      {[1, 2, 3].map((chat) => (
        <div
          key={chat}
          className={`${styles.chatContainer} ${activeChat === chat ? styles.open : ''}`}
        >
          {activeChat === chat && (
            <>
              <div className={styles.chatBox}>
                {messages[chat] && messages[chat].length > 0 ? (
                  messages[chat].map((msg, idx) => (
                    <div key={idx}>
                      {msg.text ? (
                        <div className={styles.message}>{msg.text}</div> // Text message
                      ) : (
                        <a
                          href={`/uploads/${msg.fileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.fileLink}
                        >
                          View Uploaded File
                        </a>
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
