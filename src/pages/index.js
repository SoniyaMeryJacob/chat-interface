// pages/index.js
import { useState } from "react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, type: "text" }]);
      setInputMessage("");
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setMessages([...messages, { text: data.filePath, type: "file" }]);
      }
    }
  };

  return (
    <div style={{
      padding: "20px",
      maxWidth: "600px",
      margin: "auto",
      backgroundColor: "var(--background-color)",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ color: "var(--primary-color)", textAlign: "center" }}>Chat Interface</h1>
      <div style={{
        border: "1px solid var(--primary-color)",
        padding: "10px",
        height: "400px",
        overflowY: "scroll",
        marginBottom: "10px",
        backgroundColor: "#fff",
        borderRadius: "8px"
      }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              {msg.type === "text" ? (
                <p style={{ color: "var(--primary-color)" }}>{msg.text}</p>
              ) : (
                <a
                  href={msg.text}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent-color)" }}
                >
                  View Uploaded File
                </a>
              )}
            </div>
          ))
        ) : (
          <p style={{ color: "var(--primary-color)", textAlign: "center" }}>No messages yet.</p>
        )}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message"
          style={{
            flex: 1,
            padding: "10px",
            borderColor: "var(--highlight-color)",
            borderRadius: "4px"
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "10px 20px",
            backgroundColor: "var(--secondary-color)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          Send
        </button>
      </div>
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <input type="file" onChange={handleFileUpload} />
      </div>
    </div>
  );
}
