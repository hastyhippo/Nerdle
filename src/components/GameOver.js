import React, { useContext } from "react";
import { AppContext } from "../App";

function GameOver() {
  const { gameOver, correctWord, currAttempt } = useContext(AppContext);
  return (
    <div className="gameOver">
      <p className="outcome top">
        {gameOver.guessedWord ? "You Correctly guessed the word" : "You Lost!"}
      </p>
      <p className="endingtext">
        {gameOver.guessedWord ? correctWord : "word: " + correctWord}
      </p>
      {gameOver.guessedWord && (
        <p className="outcome">in {currAttempt.attempt} attempts</p>
      )}
    </div>
  );
}

export default GameOver;
