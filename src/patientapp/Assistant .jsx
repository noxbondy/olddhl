import React, { useState, useEffect, useRef } from "react";
import "../styles/Assistant.css";
import AppNavbar from "../components/AppNavbar";

const Assistant = () => {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const backendUrl = "http://localhost:8080/chat";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(
        `${backendUrl}/chat?conversationId=${conversationId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: input }),
        }
      );

      const botResponse = await res.text();
      setMessages((prev) => [...prev, { from: "bot", text: botResponse }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Error fetching response." },
      ]);
    }

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
     <AppNavbar/>
      <button className="assistant-button" onClick={() => setOpen(!open)}>
        
        💬
      </button>
        

      {open && (
        <div className="assistant-window">
          {/* Header */}
          <div className="assistant-header">
            Assistant

            <button className="close-button"
              onClick={() => setOpen(false)}
              
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="assistant-messages"
            
          >
            {messages.length === 0 && (
              <div className="assistant-message assistant-message-bot">Start chatting...</div>
            )}
            {messages.map((msg, idx) => (
              <div className="assistant-message-container"
                key={idx}
                
              >
                <span  className="assistant-message-msg"
                  
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="assistant-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            
          >
            <textarea className="assistant-input-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type your message..."
              
            />
            <button className="assistant-input-button"
              type="submit"
              
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Assistant;
