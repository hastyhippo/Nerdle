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

let solverData = [];

app.post("/update", (req, res) => {
  if (req.body.length === 0) {
    res.status(401);
    return;
  }

  const cppProcess = spawn(cpp_path, [], { timeout: 20000 });
  let output = "";
  cppProcess.stdin.write(JSON.stringify(req.body));
  cppProcess.stdin.end();
  cppProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  cppProcess.stderr.on("data", (data) => {
    console.error(`C++ Error: ${data.toString().trim()}`);
    res.status(500).json({ error: data.toString().trim() });
  });

  cppProcess.on("exit", (code) => {
    console.log(`C++ process exited with code ${code}`);

    if (output.trim()) {
      solverData = JSON.parse(output.trim());
      console.log("Solver Data Updated:", solverData);
      res.status(200).json({ message: solverData });
    } else {
      res.status(500).json({ error: "No output from solver" });
    }
  });
});

app.get("/data", (req, res) => {
  res.json(solverData);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
