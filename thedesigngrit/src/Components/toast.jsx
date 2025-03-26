import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import "./toast.css";

const Toast = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="toast-container">
      <div className="toast-content">
        <p>{message}</p>
        <button className="toast-close" onClick={onClose}>
          <IoMdClose />
        </button>
      </div>
    </div>
  );
};

export default Toast;
