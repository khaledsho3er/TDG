import React, { useState } from "react";

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chat-popup-container">
      <button className="chat-toggle-button" onClick={toggleChat}>
        💬
      </button>
      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>Customer Support</h3>
            <button className="close-button" onClick={toggleChat}>
              ✖
            </button>
          </div>
          <div className="chat-body">
            <div className="chat-message received">
              Hello! How can I help you?
            </div>
            <div className="chat-message sent">
              I have a question about my order.
            </div>
            {/* Add more messages here */}
          </div>
          <div className="chat-footer">
            <input type="text" placeholder="Type a message..." />
            <button>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;
