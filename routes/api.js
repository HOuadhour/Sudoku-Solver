"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  app.route("/api/check").post((req, res) => {
    if (!req.body.puzzle) return res.json({ error: "Required field(s) missing" });
    else if (!req.body.coordinate) return res.json({ error: "Required field(s) missing" });
    else if (!req.body.value) return res.json({ error: "Required field(s) missing" });
    else if (req.body.puzzle.length != 81) return res.json({ error: "Expected puzzle to be 81 characters long" });
    else if (!req.body.puzzle.match(/^([1-9\.]+)$/)) return res.json({ error: "Invalid characters in puzzle" });
    else if (!req.body.coordinate.match(/^[A-I][1-9]$/i)) return res.json({ error: "Invalid coordinate" });
    else if (!req.body.value.match(/^[1-9]$/)) return res.json({ error: "Invalid value" });

    const solver = new SudokuSolver(req.body.puzzle);
    res.json(solver.check(req.body.value, req.body.coordinate, false));
  });

  app.route("/api/solve").post((req, res) => {
    if (!req.body.puzzle) return res.json({ error: "Required field missing" });
    else if (req.body.puzzle.length != 81) return res.json({ error: "Expected puzzle to be 81 characters long" });
    else if (!req.body.puzzle.match(/^([1-9\.]+)$/)) return res.json({ error: "Invalid characters in puzzle" });

    const solver = new SudokuSolver(req.body.puzzle);
    if (solver.isSolved()) res.json({ solution: solver.joinArray() });
    else res.json({ error: "Puzzle cannot be solved" });
  });
};
