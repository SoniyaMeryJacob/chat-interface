import { useState } from "react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [file, setFile] = useState(null);

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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Mock Chat Interface</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "scroll",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            {msg.type === "text" ? (
              <p>{msg.text}</p>
            ) : (
              <a href={msg.text} target="_blank" rel="noopener noreferrer">
                View Uploaded File
              </a>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message"
          style={{ flex: 1, padding: "10px" }}
        />
        <button onClick={handleSendMessage} style={{ padding: "10px" }}>
          Send
        </button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <input type="file" onChange={handleFileUpload} />
      </div>
    </div>
  );
}
