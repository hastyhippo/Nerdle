/* eslint-disable no-restricted-globals */
// Port of src/solver/solver.cpp. Runs in a worker so the UI stays responsive:
// scoring every guess against every candidate is tens of millions of compares.
import validWordsUrl from "../components/valid-words.txt";

let guesses = null; // all legal guesses, as flat char codes

const loadGuesses = async () => {
  if (guesses) return guesses;
  const text = await (await fetch(validWordsUrl)).text();
  const words = text
    .split("\n")
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length === 5);

  const codes = new Uint8Array(words.length * 5);
  words.forEach((w, i) => {
    for (let j = 0; j < 5; j++) codes[i * 5 + j] = w.charCodeAt(j) - 97;
  });
  guesses = { words, codes };
  return guesses;
};

const toCodes = (words) => {
  const codes = new Uint8Array(words.length * 5);
  words.forEach((w, i) => {
    for (let j = 0; j < 5; j++) codes[i * 5 + j] = w.charCodeAt(j) - 97;
  });
  return codes;
};

// Feedback pattern as a base-3 integer: greens first, then yellows from the
// letters greens did not consume. Mirrors markGuess in components/Words.js.
const pattern = (g, go, a, ao, counts) => {
  counts.fill(0);
  let p = 0;
  let mult = 1;
  const mark = [0, 0, 0, 0, 0];

  for (let i = 0; i < 5; i++) {
    if (g[go + i] === a[ao + i]) mark[i] = 2;
    else counts[a[ao + i]]++;
  }
  for (let i = 0; i < 5; i++) {
    if (mark[i] === 0 && counts[g[go + i]] > 0) {
      mark[i] = 1;
      counts[g[go + i]]--;
    }
  }
  for (let i = 0; i < 5; i++) {
    p += mark[i] * mult;
    mult *= 3;
  }
  return p;
};

// Expected log2 of the remaining pool after this guess. Lower is better, which
// is the ordering the C++ used.
const score = (candidates, candCodes, guessCodes, gi, buckets, counts) => {
  buckets.fill(0);
  const n = candidates.length;
  for (let c = 0; c < n; c++) {
    buckets[pattern(guessCodes, gi * 5, candCodes, c * 5, counts)]++;
  }
  let s = 0;
  for (let b = 0; b < 243; b++) {
    const k = buckets[b];
    if (k > 0) s += (k / n) * Math.log2(k);
  }
  return s;
};

self.onmessage = async ({ data: candidates }) => {
  const n = candidates.length;
  if (n === 0) return;

  // Same shortcuts the C++ took.
  if (n === 1) {
    self.postMessage([{ word: candidates[0], score: -1 }]);
    return;
  }
  if (n === 2) {
    self.postMessage(candidates.map((w) => ({ word: w, score: 0.5 })));
    return;
  }

  const { words, codes } = await loadGuesses();
  const candCodes = toCodes(candidates);
  const buckets = new Int32Array(243);
  const counts = new Int32Array(26);

  const out = [];
  for (let gi = 0; gi < words.length; gi++) {
    out.push({
      word: words[gi],
      score: score(candidates, candCodes, codes, gi, buckets, counts),
    });
  }
  out.sort((a, b) => a.score - b.score);
  self.postMessage(out.slice(0, 10));
};
