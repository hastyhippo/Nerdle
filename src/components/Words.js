import wordBank from "./wordle-bank.txt";
import validWords from "./valid-words.txt";

export const boardDefault = Array.from({ length: 6 }, () => [
  "",
  "",
  "",
  "",
  "",
]);

const loadWords = async (path) => {
  const text = await (await fetch(path)).text();
  return text
    .split("\n")
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);
};

// Answer words; also the starting pool the solver narrows down.
export const generateWordSet = async (setCurrentWordBank) => {
  const words = await loadWords(wordBank);
  setCurrentWordBank(words);
  return { todaysWord: words[Math.floor(Math.random() * words.length)] };
};

// Everything accepted as a guess, as a Set for O(1) lookup.
export const generateValidWords = async () => {
  return { wordSet: new Set(await loadWords(validWords)) };
};

// Greens first, then yellows from what is left, so a repeated letter is only
// marked once per occurrence in the answer.
export const markGuess = (guess, answer) => {
  const g = guess.toLowerCase().split("");
  const a = answer.toLowerCase().split("");
  const marks = new Array(g.length).fill("error");

  for (let i = 0; i < g.length; i++) {
    if (g[i] === a[i]) {
      marks[i] = "correct";
      a[i] = null;
    }
  }
  for (let i = 0; i < g.length; i++) {
    if (marks[i] === "correct") continue;
    const j = a.indexOf(g[i]);
    if (j !== -1) {
      marks[i] = "almost";
      a[j] = null;
    }
  }
  return marks;
};
