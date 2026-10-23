import "./App.css";
import Keyboard from "./components/Keyboard";
import Board from "./components/Board";
import GameOver from "./components/GameOver";
import PopupMessage from "./components/Popup";

import { createContext, useCallback, useEffect, useState } from "react";
import {
  boardDefault,
  generateValidWords,
  generateWordSet,
  markGuess,
} from "./components/Words";
import WordRankings from "./components/WordRankings";
import SearchSpace from "./components/SearchSpace";

export const AppContext = createContext();

// No backend -> rankings stay at their seeded values. `npm start` still talks
// to a local server.js; a production build only does if the var is set.
const SOLVER_URL =
  process.env.REACT_APP_SOLVER_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "");

const SEED_RESULTS = [
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
];

// Build the test once per guess, not once per candidate: the word bank is
// ~12k entries, so hoisting the lowercasing out of the loop is most of the win.
const makeFilter = (greens, yellows, greys) => {
  const g = greens.map((p) => [p.position, p.letter.toLowerCase()]);
  const y = yellows.map((p) => [p.position, p.letter.toLowerCase()]);
  const grey = [...new Set(greys.map((l) => l.toLowerCase()))];

  return (word) => {
    for (const [pos, ch] of g) if (word[pos] !== ch) return false;

    // A letter already claimed by a green cannot also satisfy a yellow.
    const pool = word.split("");
    for (const [pos] of g) pool[pos] = null;

    for (const [pos, ch] of y) {
      if (word[pos] === ch) return false;
      const j = pool.indexOf(ch);
      if (j === -1) return false;
      pool[j] = null;
    }
    for (const ch of grey) if (pool.includes(ch)) return false;
    return true;
  };
};

function App() {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [almostLetters, setAlmostLetters] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [currentWordBank, setCurrentWordBank] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [history, setHistory] = useState([]);
  const [results, setResults] = useState(SEED_RESULTS);
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });
  const [correctWord, setCorrectWord] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [rankingsLoading, setRankingsLoading] = useState(false);

  const fetchRankings = useCallback(async (bank, signal) => {
    setRankingsLoading(true);
    try {
      const response = await fetch(`${SOLVER_URL}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bank),
        signal,
      });
      const data = await response.json();
      setResults(data.message);
    } catch (error) {
      if (error.name !== "AbortError") console.error("Solver unavailable:", error);
    } finally {
      if (!signal.aborted) setRankingsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!SOLVER_URL || currentWordBank.length === 0) return;
    const controller = new AbortController();
    fetchRankings(currentWordBank, controller.signal);
    return () => controller.abort();
  }, [currentWordBank, fetchRankings]);

  useEffect(() => {
    generateWordSet((words) => {
      setCurrentWordBank(words);
      setAllWords(words);
    }).then(({ todaysWord }) => setCorrectWord(todaysWord));
    generateValidWords().then(({ wordSet }) => setWordSet(wordSet));
  }, []);

  const onSelectLetter = useCallback(
    (keyVal) => {
      setAttempt((a) => {
        if (a.letterPos > 4) return a;
        setBoard((b) => {
          const next = b.map((row) => [...row]);
          next[a.attempt][a.letterPos] = keyVal;
          return next;
        });
        return { ...a, letterPos: a.letterPos + 1 };
      });
    },
    []
  );

  const onDelete = useCallback(() => {
    setAttempt((a) => {
      if (a.letterPos === 0) return a;
      setBoard((b) => {
        const next = b.map((row) => [...row]);
        next[a.attempt][a.letterPos - 1] = "";
        return next;
      });
      return { ...a, letterPos: a.letterPos - 1 };
    });
  }, []);

  // Clicking a suggestion drops it into the current row, ready to submit.
  const onFillWord = useCallback(
    (word) => {
      if (gameOver.gameOver) return;
      const letters = word.toUpperCase().split("");
      if (letters.length !== 5) return;
      setBoard((b) => {
        const next = b.map((row) => [...row]);
        next[currAttempt.attempt] = letters;
        return next;
      });
      setAttempt((a) => ({ ...a, letterPos: 5 }));
    },
    [currAttempt.attempt, gameOver.gameOver]
  );

  const onEnter = useCallback(() => {
    if (currAttempt.letterPos !== 5) return;

    const currWord = board[currAttempt.attempt].join("");
    if (!wordSet.has(currWord.toLowerCase())) {
      setShowPopup(true);
      return;
    }

    // Classify the whole guess here rather than in each Letter: one pass, and
    // the word bank can be narrowed in the same step.
    const marks = markGuess(currWord, correctWord);
    const greens = [];
    const yellows = [];
    const greys = [];
    marks.forEach((mark, i) => {
      const ch = currWord[i].toUpperCase();
      if (mark === "correct") greens.push({ letter: ch, position: i });
      else if (mark === "almost") yellows.push({ letter: ch, position: i });
      else greys.push(ch);
    });

    setCorrectLetters((prev) => [...prev, ...greens.map((p) => p.letter)]);
    setAlmostLetters((prev) => [...prev, ...yellows.map((p) => p.letter)]);
    setDisabledLetters((prev) => [...prev, ...greys]);

    const keep = makeFilter(greens, yellows, greys);
    setCurrentWordBank((prev) => {
      const next = prev.filter(keep);
      setHistory((h) => [
        ...h,
        { guess: currWord.toLowerCase(), before: prev.length, after: next.length },
      ]);
      return next;
    });

    setAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 });

    if (currWord.toUpperCase() === correctWord.toUpperCase()) {
      setGameOver({ gameOver: true, guessedWord: true });
    } else if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
    }
  }, [board, currAttempt, wordSet, correctWord]);

  return (
    <div className="App">
      <nav>
        <h1>Nerdle</h1>
      </nav>
      <AppContext.Provider
        value={{
          board,
          setBoard,
          currAttempt,
          setAttempt,
          onDelete,
          onEnter,
          onSelectLetter,
          onFillWord,
          correctWord,
          disabledLetters,
          almostLetters,
          correctLetters,
          gameOver,
          setGameOver,
          currentWordBank,
          allWords,
          history,
          results,
          rankingsLoading,
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
            <SearchSpace />
          </div>
        </div>
      </AppContext.Provider>
      <p className="copyright">
        Made by Nathan Lin™ at:{"  "}
        <a href="https://github.com/hastyhippo">Github</a>
      </p>
    </div>
  );
}

export default App;
