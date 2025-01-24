import React, { useState } from "react";
import MessageIcon from "@mui/icons-material/Message";
import CloseIcon from "@mui/icons-material/Close";

function FloatingButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="floating-button" onClick={toggleChat}>
        <MessageIcon />
      </div>

      {/* Chat Popup */}
      {isChatOpen && (
        <div className="chat-popup">
          {/* Chat Header */}
          <div className="chat-header">
            <span>Customer Support</span>
            <CloseIcon className="close-icon" onClick={toggleChat} />
          </div>

          {/* Chat Body */}
          <div className="chat-body">
            <div className="message received">Hello! How can I assist you?</div>
            <div className="message sent">
              I have a question about my order.
            </div>
          </div>

          {/* Chat Footer */}
          <div className="chat-footer">
            <input
              type="text"
              placeholder="Type a message..."
              className="message-input"
            />
            <button className="send-button">Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingButton;
