import React, { useContext } from "react";
import { AppContext } from "../App";

function GameOver() {
  const { gameOver, correctWord, currAttempt } = useContext(AppContext);
  return (
    <div className="gameOver">
      <h1 className="outcome top">
        {gameOver.guessedWord ? "You Correctly guessed the word" : "You Lost!"}
      </h1>
      <h1 className="endingtext">
        {gameOver.guessedWord ? correctWord : "word: " + correctWord}
      </h1>
      {gameOver.guessedWord && (
        <h3 className="outcome">in {currAttempt.attempt} attempts</h3>
      )}
    </div>
  );
}

export default GameOver;
