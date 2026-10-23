import React, { useContext, useMemo } from "react";
import { AppContext } from "../App";
import { markGuess } from "./Words";

function Letter({ letterPos, attemptVal }) {
  const { board, correctWord, currAttempt } = useContext(AppContext);
  const letter = board[attemptVal][letterPos];
  const submitted = currAttempt.attempt > attemptVal;

  // Marking depends on the whole row, not this square, so compute it once per
  // row and memoise rather than redoing it in all five squares every render.
  const marks = useMemo(
    () =>
      submitted && correctWord
        ? markGuess(board[attemptVal].join(""), correctWord)
        : null,
    [submitted, correctWord, board, attemptVal]
  );

  const letterState = marks ? marks[letterPos] : false;
  const fill = submitted ? "" : letter !== "" ? "filled" : "empty";

  return (
    <div className={`letter ${fill}`} id={letterState}>
      {letter}
    </div>
  );
}

export default Letter;
