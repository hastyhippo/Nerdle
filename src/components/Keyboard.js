import React, { useCallback, useContext, useEffect, useMemo } from "react";
import Key from "./Key";
import { AppContext } from "../App";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

function Keyboard() {
  const {
    onEnter,
    onDelete,
    onSelectLetter,
    disabledLetters,
    almostLetters,
    correctLetters,
  } = useContext(AppContext);

  // Sets, so colouring 26 keys is 26 lookups rather than 78 array scans.
  const disabled = useMemo(() => new Set(disabledLetters), [disabledLetters]);
  const almost = useMemo(() => new Set(almostLetters), [almostLetters]);
  const correct = useMemo(() => new Set(correctLetters), [correctLetters]);

  const handleKeyboard = useCallback(
    (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === "Enter") return onEnter();
      if (event.key === "Backspace") return onDelete();
      if (/^[a-z]$/i.test(event.key)) onSelectLetter(event.key.toUpperCase());
    },
    [onEnter, onDelete, onSelectLetter]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, [handleKeyboard]);

  const stateOf = (key) =>
    correct.has(key) ? "correct" : almost.has(key) ? "almost" : disabled.has(key) ? "disabled" : "";

  return (
    <div className="keyboard">
      {ROWS.map((row, i) => (
        <div className={`line${i + 1}`} key={i}>
          {i === 2 && <Key keyVal="ENTER" bigKey />}
          {row.map((key) => (
            <Key key={key} keyVal={key} state={stateOf(key)} />
          ))}
          {i === 2 && <Key keyVal="DELETE" bigKey />}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
