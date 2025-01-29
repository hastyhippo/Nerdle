import React, { useContext } from "react";
import { AppContext } from "../App";

function Key({ keyVal, bigKey, state }) {
  const { onEnter, onDelete, onSelectLetter } = useContext(AppContext);
  const selectLetter = () => {
    if (keyVal === "ENTER") {
      onEnter();
    } else if (keyVal === "DELETE") {
      onDelete();
    } else {
      onSelectLetter(keyVal);
    }
  };
  return (
    <div className="key" id={bigKey ? "big" : state} onClick={selectLetter}>
      {keyVal}
    </div>
  );
}

export default Key;
