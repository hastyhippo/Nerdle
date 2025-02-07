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

app.post("/update", (req, res) => {
  // const cppProcess = spawn(cpp_path);
  // let output = "";
  // cppProcess.stdin.write(JSON.stringify(req.body));
  // cppProcess.stdin.end();
  // cppProcess.stdout.on("data", (data) => {
  //   output += data.toString();
  // });
  // cppProcess.stdout.on("end", () => {
  //   console.log(`C++ Output: ${output.trim()}`);
  //   res.json({ message: output.trim() });
  //   return;
  // });
  // cppProcess.stderr.on("data", (data) => {
  //   console.error(`C++ Error: ${data.toString().trim()}`);
  //   res.status(500).json({ error: data.toString().trim() });
  // });
  // cppProcess.on("exit", (code) => {
  //   console.log(`C++ process exited with code ${code}`);
  //   if (code !== 0) {
  //     res.status(500).json({ error: `Solver exited with code ${code}` });
  //   }
  // });
});

app.get("/data", (res) => {
  res.json(dataStore);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
