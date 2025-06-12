# Nerdle

Wordle clone written in React JS, CSS, HTML and C++

A sidebar contains the optimal guess, based on information theory alongside some precomputation.
To speed up computation, C++ was integrated into the codebase, using bitwise operations and search algorithms.

Run the following commands to start: 

npm i yarn

yarn start

# Wordle Clone
![image](https://github.com/user-attachments/assets/76489517-15e3-411f-a133-9bdc7d063fb8)

Imitates the visual features of Wordle, from the keyboard to the board, every detail is incorporated from the original game. An infinite word bank is used.


# Solver
To solve the game, information is used to simulate ahead and find the guess that will reduce the search space by as much as possible, even in the worst case.

Each state in the game can be represented as:

**State**

- Green: (letters which are known) (e, 3), (f,1) <- there must be an f at 1, and e at 3

- Yellow: (letters which are present but are not at certain positions: (g, {3,4}), (a,2) there is a 'g' in the word that is not at 3 or 4 and an 'a' that is not at 2

- Grey: (letters which are definitely not present)


Each of these states contain several words which are valid. For example a word which satisfies: 

- Green: (a,1), (e,5)
- Yellow (m,3)
- Grey: (b,y,k,z)

could be amaze, amuse, amble

This means this state has 3 possibilites. Intuitively, the more possibilities, the worse a state is for us because we will have to guess more to narrow the search space down. The way the solver works is by guessing every possible word. Then to evaluate how good the word is, it looks at the search space, and splits the search space into different groups which all have the same state.
E.g. The search space amaze, amuse, amble, final, fails, freer

would be put in {amaze, amuse, amble}, {final, fails}, {freer}

If everything in one group has the same state. The best guess is just the guess which splits up the search space as much as possible which can be turned into a heuristic by information theory, taking the sum of all states -log2(x), where x is the number of guesses in a state. -log2(x) serves as a heuristic to assess how good a guess is, where the lower the number is, the better. Some common numbers are: -log2(x) = 0, which means this guess will be guaranteed to shrink the next search to 1, so we can expect to solve the game in 1 more guess after the current guess. value: -1, where it is guarnateed. As log(x) is undefined, I have programmed it to -1, to represent a guaranteed win. 

It repeatedly does this efficiently via bitwise opeartions, but is still too slow to do the first guess in under 10 seconds, so the first guess is precomputed since it is always the same anyway under these conditions. Potential optimisations via pruning may help.

# Example games:

![image](https://github.com/user-attachments/assets/23e57192-74bc-4452-a544-91392bf0cd0c)

![image](https://github.com/user-attachments/assets/73f6d97a-0b99-4d73-b297-ad4cb90e0e12)

![image](https://github.com/user-attachments/assets/59a6049a-8293-4107-9e19-01a49bc81358)

![image](https://github.com/user-attachments/assets/b24d3a44-22c3-479e-90e6-080c7db7b2e7)

(Carve: 3 attempts)

![image](https://github.com/user-attachments/assets/dd4aac79-acb0-42b4-a2e5-4ada4f6046f9)

![image](https://github.com/user-attachments/assets/784e3413-cba1-4247-a9a3-810760038a15)

![image](https://github.com/user-attachments/assets/5a634663-3643-444c-ad38-eb575f670cd0)

(Hater: 4 attempts)
