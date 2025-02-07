import wordBank from "./wordle-bank.txt";
import validWords from "./valid-words.txt";
export const boardDefault = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

export const generateWordSet = async (setCurrentWordBank) => {
  let todaysWord;

  await fetch(wordBank)
    .then((response) => response.text())
    .then((result) => {
      let validWords = result.split("\n");
      setCurrentWordBank(validWords);
      todaysWord = validWords[Math.floor(Math.random() * validWords.length)];
      console.log(todaysWord);
    });

  return { todaysWord };
};

export const generateValidWords = async () => {
  let wordSet;

  await fetch(validWords)
    .then((response) => response.text())
    .then((result) => {
      const wordArr = result.split("\n");
      wordSet = new Set(wordArr);
    });

  return { wordSet };
};
