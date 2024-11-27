import { useState } from "react";
import ChatInterface from "./chat";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <button
        onClick={toggleChat}
        style={{
          padding: "15px 30px",
          backgroundColor: "#F27405", // Secondary color from your theme
          color: "#fff",
          border: "none",
          cursor: "pointer",
          borderRadius: "8px",
          fontSize: "18px"
        }}
      >
        {isChatOpen ? "Close Chat" : "Open Chat"}
      </button>

      {isChatOpen && (
        <div style={{
          marginTop: "20px",
          transition: "all 0.3s ease",
          backgroundColor: "#F2F2F2",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}>
          <ChatInterface />
        </div>
      )}
    </div>
  );
}
