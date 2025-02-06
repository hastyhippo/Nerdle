const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const cpp_path = path.join(__dirname, "src", "solver", "solver.exe");

let dataStore = {
  correctLetters: [],
  almostLetters: [],
  wrongLetters: [],
};

app.post("/update", (req, res) => {
  const guessData = req.body;
  dataStore.correctLetters = guessData.correctLetters;
  dataStore.almostLetters = guessData.almostLetters;
  dataStore.wrongLetters = guessData.disabledLetters;

  const cppProcess = spawn(cpp_path);

  cppProcess.stdin.write(JSON.stringify(guessData));
  cppProcess.stdin.end();
  cppProcess.stdout.on("data", (data) => {
    console.log(`${data.toString().trim()}`);
  }); // exec(`${cpp_path}`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error executing script: ${error.message}`);
  //     return res.status(500).json({ error: error.message });
  //   }
  //   if (stderr) {
  //     console.error(`Script error: ${stderr}`);
  //     return res.status(500).json({ error: stderr });
  //   }
  //   console.log(`C++ Output: ${stdout.trim()}`);
  //   res.json({ message: stdout.trim() });
  // });
  // console.log("Data:", dataStore);
});

app.get("/data", (res) => {
  res.json(dataStore);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
