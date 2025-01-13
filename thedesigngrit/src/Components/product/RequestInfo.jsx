import React from "react";

const RequestQuotePopup = ({ onClose }) => {
  return (
    <div className="requestInfo-popup-overlay">
      <div className="requestInfo-popup">
        <div className="requestInfo-popup-header">
          <h2>REQUEST INFO</h2>
          <button className="requestInfo-close-button" onClick={onClose}>
            X
          </button>
        </div>
        <div className="requestInfo-popup-content">
          <div className="requestInfo-brand-info">
            <img
              src="/logo.png"
              alt="Istikbal"
              className="requestInfo-brand-logo"
            />
            <h3>Get In Touch</h3>
            <h2>ISTIKBAL</h2>
          </div>
          <div className="requestInfo-user-info">
            <p>Karim Wahba</p>
            <p>Karimwahba@gmail.com</p>
            <p>Date: 12/12/2022</p>
          </div>
          <form className="requestInfo-form">
            <div className="requestInfo-form-group">
              <label>Material</label>
              <div className="requestInfo-input-group">
                <select>
                  <option>Wool Fabric</option>
                  {/* Add more options here */}
                </select>
                <input type="text" placeholder="Others..." />
              </div>
            </div>
            <div className="requestInfo-form-group">
              <label>Size</label>
              <div className="requestInfo-input-group">
                <select>
                  <option>4080 x 1000</option>
                  {/* Add more options here */}
                </select>
                <input type="text" placeholder="Others..." />
              </div>
            </div>
            <div className="requestInfo-form-group">
              <label>Colour</label>
              <div className="requestInfo-input-group">
                <select>
                  <option>White Grey</option>
                  {/* Add more options here */}
                </select>
                <input type="text" placeholder="Others..." />
              </div>
            </div>
            <div className="requestInfo-form-group">
              <label>Customization</label>
              <textarea placeholder="Add a note..."></textarea>
            </div>
            <button type="submit" className="requestInfo-submit-button">
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestQuotePopup;
