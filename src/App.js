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
const isValid = (correctLetters, almostLetters, disabledLetters, word) => {
  let str = word.toUpperCase().split("");
  for (let pair of correctLetters) {
    if (word[pair.position].toUpperCase() !== pair.letter.toUpperCase()) {
      return false;
    }
    str[pair.position] = 0;
  }

  for (let pair of almostLetters) {
    if (word[pair.position].toUpperCase() === pair.letter.toUpperCase()) {
      return false;
    }
    if (!str.includes(pair.letter)) {
      return false;
    }
    str[str.indexOf(pair.letter)] = "-";
  }

  for (let letter of disabledLetters) {
    if (str.includes(letter)) {
      return false;
    }
  }
  return true;
};

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
  const [currentWordBank, setCurrentWordBank] = useState([]);
  const [results, setResults] = useState([
    { score: 5.293740195096457, word: "soare" },
    { score: 5.29775916800615, word: "roate" },
    { score: 5.299916260372627, word: "raise" },
    { score: 5.313051076665297, word: "raile" },
    { score: 5.313511809209426, word: "reast" },
    { score: 5.324089998968738, word: "slate" },
    { score: 5.344739676141134, word: "crate" },
    { score: 5.345233005895171, word: "salet" },
    { score: 5.346819275998285, word: "irate" },
    { score: 5.349059368671523, word: "trace" },
  ]);

  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });
  const [correctWord, setCorrectWord] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const fetchRankings = async (controller) => {
    try {
      const response = await fetch("http://localhost:5000/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentWordBank),
        signal: controller.signal,
      });

      const data = await response.json();
      setResults(data.message);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (currentWordBank.length === 0) return;
    console.log(currentWordBank);
    const controller = new AbortController();

    fetchRankings(controller);

    return () => controller.abort();
  }, [currentWordBank]);

  useEffect(() => {
    generateWordSet(setCurrentWordBank).then((words) => {
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
    if (
      localCorrectLetters.length > 0 ||
      localAlmostLetters.length > 0 ||
      localDisabledLetters.length > 0
    ) {
      setCurrentWordBank((prev) =>
        prev.filter((word) =>
          isValid(
            localCorrectLetters,
            localAlmostLetters,
            localDisabledLetters,
            word
          )
        )
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
      // update word bank
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
          setCurrentWordBank,
          currentWordBank,
          results,
          setResults,
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
