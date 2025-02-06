import "./App.css";
import Keyboard from "./components/Keyboard";
import Board from "./components/Board";
import GameOver from "./components/GameOver";
import PopupMessage from "./components/Popup";

import { createContext, useEffect, useState } from "react";
import {
  boardDefault,
  generateValidWords,
  generateWordSet,
} from "./components/Words";
import WordRankings from "./components/WordRankings";

export const AppContext = createContext();

function App() {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [almostLetters, setAlmostLetters] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [localCorrectLetters, setLocalCorrectLetters] = useState([]);
  const [localAlmostLetters, setLocalAlmostLetters] = useState([]);
  const [localDisabledLetters, setLocalDisabledLetters] = useState([]);

  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });
  const [correctWord, setCorrectWord] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    generateWordSet().then((words) => {
      setCorrectWord(words.todaysWord);
    });
    generateValidWords().then((words) => {
      setWordSet(words.wordSet);
    });
  }, []);

  const onSelectLetter = (keyVal) => {
    if (currAttempt.letterPos > 4) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal;
    setBoard(newBoard);
    setAttempt({ ...currAttempt, letterPos: currAttempt.letterPos + 1 });
  };

  const onDelete = () => {
    if (currAttempt.letterPos === 0) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = "";
    setBoard(newBoard);
    setAttempt({ ...currAttempt, letterPos: currAttempt.letterPos - 1 });
  };
  useEffect(() => {
    const correctData = {
      correctLetters: localCorrectLetters,
    };
    console.log(correctData);
    if (localCorrectLetters.length === 0) return;

    fetch("http://localhost:5000/correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(correctData),
    });
    // .then((data) => console.log("Server response:", data))
    // .catch((error) => console.error("Error sending data to server:", error));
  }, [localCorrectLetters]);

  useEffect(() => {
    if (
      localCorrectLetters.length > 0 ||
      localAlmostLetters.length > 0 ||
      localDisabledLetters.length > 0
    ) {
      const data = {
        correctLetters: localCorrectLetters,
        almostLetters: localAlmostLetters,
        disabledLetters: localDisabledLetters,
      };

      fetch("http://localhost:5000/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => console.log("Server response:", data))
        .catch((error) =>
          console.error("Error sending data to server:", error)
        );
    }
  }, [localCorrectLetters, localAlmostLetters, localDisabledLetters]);

  const onEnter = () => {
    if (currAttempt.letterPos !== 5) return;

    let currWord = "";
    for (let i = 0; i < 5; i++) {
      currWord += board[currAttempt.attempt][i];
    }

    if (wordSet.has(currWord.toLowerCase())) {
      // If attempt is valid
      setAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 });

      setLocalCorrectLetters([]);
      setLocalAlmostLetters([]);
      setLocalDisabledLetters([]);

      if (currWord.toUpperCase() === correctWord.toUpperCase()) {
        setGameOver({ gameOver: true, guessedWord: true });
        return;
      }

      if (currAttempt.attempt === 5) {
        setGameOver({ gameOver: true, guessedWord: false });
      }
      return;
    } else {
      setShowPopup(true);
      return;
    }
  };

  return (
    <div className="App">
      <nav>
        <h1>Nerdle</h1>
      </nav>{" "}
      <AppContext.Provider
        value={{
          board,
          setBoard,
          currAttempt,
          setAttempt,
          onDelete,
          onEnter,
          onSelectLetter,
          correctWord,
          setDisabledLetters,
          disabledLetters,
          setGameOver,
          gameOver,
          correctLetters,
          setCorrectLetters,
          almostLetters,
          setAlmostLetters,
          setLocalCorrectLetters,
          setLocalAlmostLetters,
          setLocalDisabledLetters,
        }}
      >
        <div className="wrapper">
          <div className="game">
            <PopupMessage showPopup={showPopup} setShowPopup={setShowPopup} />
            <Board />
            {gameOver.gameOver ? <GameOver /> : <Keyboard />}
          </div>
          <div className="solver">
            <WordRankings />
          </div>
        </div>
      </AppContext.Provider>
      <p1 className="copyright">
        Made by Nathan Lin™ at:{"  "}
        <a href="https://github.com/PHILIVEY123">Github</a>
      </p1>
    </div>
  );
}

export default App;
