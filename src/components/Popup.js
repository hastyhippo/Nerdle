import React, { useEffect } from "react";

const PopupMessage = ({ showPopup, setShowPopup }) => {
  useEffect(() => {
    if (showPopup) {
      const timeout = setTimeout(() => {
        setShowPopup(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [showPopup]);

  return (
    <div>
      <div className={`popup ${!showPopup ? "fade-out" : ""}`}>
        <p className="popuptext">Not a word!</p>
      </div>
    </div>
  );
};

export default PopupMessage;
