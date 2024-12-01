import { useState } from 'react';
import styles from '../styles/Chat.module.css';

export default function SlidingChat() {
  const [activeChat, setActiveChat] = useState(null); // Active chat state
  const [messages, setMessages] = useState({ 1: [], 2: [], 3: [] }); // Messages state per chat
  const [currentMessage, setCurrentMessage] = useState(''); // Current input message

  // Function to toggle the chat tab
  const toggleChat = (chatNumber) => {
    setActiveChat((prevChat) => (prevChat === chatNumber ? null : chatNumber));
  };

  // Function to send a text message
  const sendMessage = () => {
    if (currentMessage.trim() && activeChat) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [activeChat]: [...prevMessages[activeChat], { text: currentMessage }],
      }));
      setCurrentMessage(''); // Clear input field
    }
  };

  // Function to handle file uploads
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && activeChat) {
      const formData = new FormData();
      formData.append('file', file);

      // Example API call for file upload
      fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.fileUrl) {
            setMessages((prevMessages) => ({
              ...prevMessages,
              [activeChat]: [...prevMessages[activeChat], { fileName: data.fileUrl }],
            }));
          }
        })
        .catch((error) => console.error('Error uploading file:', error));
    }
  };

  return (
    <div className={styles.container}>
      {/* Chat Tabs */}
      {[1, 2, 3].map((chat) => (
        <div
          key={chat}
          className={`${styles.chatContainer} ${activeChat === chat ? styles.open : styles.collapsed}`}
        >
          {/* Chat Tag */}
          <div className={styles.chatTag} onClick={() => toggleChat(chat)}>
            CHAT {chat}
          </div>

          {/* Expanded Chat Box */}
          {activeChat === chat && (
            <>
              <div className={styles.chatBox}>
                {messages[chat]?.length > 0 ? (
                  messages[chat].map((msg, idx) => (
                    <div key={idx}>
                      {msg.text ? (
                        <div className={styles.message}>{msg.text}</div>
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

              {/* Input Area */}
              <div className={styles.inputArea}>
                <input
                  type="text"
                  placeholder="Type a message"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className={styles.inputField}
                />
                <input type="file" className={styles.fileUpload} onChange={handleFileUpload} />
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
