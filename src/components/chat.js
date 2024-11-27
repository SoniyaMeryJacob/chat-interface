// src/components/chat.js
import { useState } from 'react';
import styles from '../styles/Chat.module.css'; // Import the module styles

export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [file, setFile] = useState(null);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // Add the message to the state, using functional state update
      setMessages((prevMessages) => [...prevMessages, { type: 'text', text: inputMessage }]);
      setInputMessage(''); // Clear the input after sending
    }
  };

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    const formData = new FormData();
    formData.append('file', uploadedFile);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (response.ok) {
      // Add the uploaded file's path to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'file', text: result.file.filepath }, // Assuming `filepath` is returned from the API
      ]);
    } else {
      alert('Failed to upload file');
    }
  };

  return (
    <div className={`${styles.chatContainer} ${isChatOpen ? styles.open : ''}`}>
      <div className={styles.chatTag} onClick={toggleChat}>
        CHAT
      </div>
      <div className={styles.chatBox}>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index}>
              {msg.type === 'text' ? (
                <div>{msg.text}</div>
              ) : (
                <div>
                  <a href={`/uploads/${msg.text}`} target="_blank" rel="noopener noreferrer">
                    View Uploaded File
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className={styles.inputArea}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message"
          className={styles.inputField}
        />
        <input
          type="file"
          onChange={handleFileUpload}
          className={styles.fileUpload}
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}
