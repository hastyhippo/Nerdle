import React, { useContext, useEffect } from "react";
import { AppContext } from "../App";

function Letter({ letterPos, attemptVal }) {
  const {
    board,
    correctWord,
    currAttempt,
    setDisabledLetters,
    setAlmostLetters,
    setCorrectLetters,
  } = useContext(AppContext);
  const letter = board[attemptVal][letterPos];

  let word = correctWord.toUpperCase().split("");
  let ourWord = Array.from(board[attemptVal]);
  for (let i = 0; i < 5; i++) {
    if (word[i] === board[attemptVal][i]) {
      word[i] = "-";
      ourWord[i] = "-";
      continue;
    }
  }
  for (let i = 0; i < letterPos; i++) {
    if (word.includes(ourWord[i])) {
      word[word.indexOf(ourWord[i])] = "-";
    }
  }
  const correct = correctWord.toUpperCase()[letterPos] === letter;
  const almost = !correct && letter !== "" && word.includes(letter);

  const letterState =
    currAttempt.attempt > attemptVal &&
    (correct ? "correct" : almost ? "almost" : "error");

  useEffect(() => {
    if (letter !== "") {
      if (correct) {
        setCorrectLetters((prev) => [...prev, letter]);
      } else if (almost) {
        setAlmostLetters((prev) => [...prev, letter]);
      } else {
        setDisabledLetters((prev) => [...prev, letter]);
      }
    }
  }, [currAttempt.attempt]);
  console.log(currAttempt);
  console.log(attemptVal);
  return (
    <div
      className={`letter ${currAttempt.attempt > attemptVal ? "" : letter !== "" ? "filled" : "empty"}`}
      id={letterState}
    >
      {letter}
    </div>
  );
}

export default Letter;
