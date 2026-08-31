import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import "./AIMentor.css";
import { sendMessageToAIMentor } from "../services/api";
import Navbar from "../components/Navbar";

function AIMentor() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm your AI Placement Mentor. Ask me anything about placements, DSA, resumes, interviews, or career preparation!",
    },
  ]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMessage = {
      role: "user",
      text: message,
    };

    setMessages((prev) => [...prev, newMessage]);

    const userMessage = message;

    setMessage("");

    try {
      const token = sessionStorage.getItem("token");

      const response = await sendMessageToAIMentor(userMessage, token);
      const aiMessage = {
        role: "ai",
        text: response.data.reply,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log("Failed to get AI response:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    }
  };

  return (
    <div className="student-layout">
      <Navbar />

      <main className="main-content">
        <div className="ai-mentor-page">
          {/* Header */}
          <div className="ai-mentor-header">
            <div className="ai-icon">
              <Bot size={32} />
            </div>

            <div>
              <h1>AI Placement Mentor</h1>
              <p>Your personal guide for placements and career preparation.</p>
            </div>
          </div>

          {/* Chat Box */}
          <div className="chat-container">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.role === "user" ? "user-message" : "ai-message"
                  }`}
                >
                  <div className="message-icon">
                    {msg.role === "user" ? (
                      <User size={20} />
                    ) : (
                      <Bot size={20} />
                    )}
                  </div>

                  <div className="message-text">{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="chat-input">
              <input
                type="text"
                placeholder="Ask your AI Mentor anything..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
              />

              <button onClick={handleSend}>
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AIMentor;
