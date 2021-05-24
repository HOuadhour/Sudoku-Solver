const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const validPuzzles = require("../controllers/puzzle-strings").puzzlesAndSolutions;

let solver;

suite("UnitTests", () => {
  test("Logic handles a valid puzzle string of 81 characters", () => {
    for (let i = 0; i < validPuzzles.length; i++) {
      solver = new Solver(validPuzzles[i][0]);
      assert.deepEqual(solver.validatePuzzle(), 0);
      assert.isArray(solver.puzzleArray);
    }
  });
  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
    solver = new Solver("x".repeat(81));
    assert.deepEqual(solver.validatePuzzle(), -2);
    assert.isNull(solver.puzzleArray);
  });
  test("Logic handles a puzzle string that is not 81 characters in length", () => {
    solver = new Solver("");
    assert.deepEqual(solver.validatePuzzle(), -1);
    assert.isNull(solver.puzzleArray);
  });
  test("Logic handles a valid row placement", () => {
    solver = new Solver(validPuzzles[0][0]);
    assert.deepEqual(solver.validatePuzzle(), 0);
    assert.isArray(solver.puzzleArray);
    assert.isArray(solver.check("6", "A2", false).conflict);
    assert.equal(solver.check("6", "A2", false).conflict.length, 2);
    assert.equal(solver.check("6", "A2", false).conflict[0], "column");
    assert.equal(solver.check("6", "A2", false).conflict[1], "region");
  });

  test("Logic handles an invalid row placement", () => {
    solver = new Solver(validPuzzles[0][0]);
    assert.deepEqual(solver.validatePuzzle(), 0);
    assert.isArray(solver.puzzleArray);
    assert.isArray(solver.check("4", "A2", false).conflict);
    assert.equal(solver.check("4", "A2", false).conflict.length, 1);
    assert.equal(solver.check("4", "A2", false).conflict[0], "row");
  });

  test("Logic handles a valid column placement", () => {
    solver = new Solver(validPuzzles[0][0]);
    assert.deepEqual(solver.validatePuzzle(), 0);
    assert.isArray(solver.puzzleArray);
    assert.isArray(solver.check("5", "A2", false).conflict);
    assert.equal(solver.check("5", "A2", false).conflict.length, 2);
    assert.equal(solver.check("5", "A2", false).conflict[0], "row");
    assert.equal(solver.check("5", "A2", false).conflict[1], "region");
  });

  test("Logic handles an invalid column placement", () => {
    solver = new Solver(validPuzzles[0][0]);
    assert.deepEqual(solver.validatePuzzle(), 0);
    assert.isArray(solver.puzzleArray);
    assert.isArray(solver.check("9", "A2", false).conflict);
    assert.equal(solver.check("9", "A2", false).conflict.length, 1);
    assert.equal(solver.check("9", "A2", false).conflict[0], "column");
  });

  test("Logic handles a valid region (3x3 grid) placement", () => {
    solver = new Solver(validPuzzles[0][0]);
    assert.deepEqual(solver.validatePuzzle(), 0);
    assert.isArray(solver.puzzleArray);
    assert.isArray(solver.check("6", "B4", false).conflict);
    assert.equal(solver.check("6", "B4", false).conflict.length, 2);
    assert.equal(solver.check("6", "B4", false).conflict[0], "row");
    assert.equal(solver.check("6", "B4", false).conflict[1], "column");
  });

  test("Logic handles an invalid region (3x3 grid) placement", () => {
    solver = new Solver(validPuzzles[0][0]);
    assert.deepEqual(solver.validatePuzzle(), 0);
    assert.isArray(solver.puzzleArray);
    assert.isArray(solver.check("5", "B4", false).conflict);
    assert.equal(solver.check("5", "B4", false).conflict.length, 1);
    assert.equal(solver.check("5", "B4", false).conflict[0], "region");
  });

  test("Valid puzzle strings pass the solver", () => {
    for (let i = 0; i < validPuzzles.length; i++) {
      solver = new Solver(validPuzzles[i][0]);
      assert.deepEqual(solver.validatePuzzle(), 0);
      assert.isArray(solver.puzzleArray);
      assert.isTrue(solver.solve());
    }
  });

  test("Invalid puzzle strings fail the solver", () => {
    solver = new Solver("1".repeat(80) + ".");
    assert.deepEqual(solver.validatePuzzle(), 0);
    assert.isArray(solver.puzzleArray);
    assert.isFalse(solver.isSolved());
  });

  test("Solver returns the expected solution for an incomplete puzzle", () => {
    for (let i = 0; i < validPuzzles.length; i++) {
      solver = new Solver(validPuzzles[i][0]);
      assert.deepEqual(solver.validatePuzzle(), 0);
      assert.isArray(solver.puzzleArray);
      assert.isTrue(solver.solve());
      assert.deepEqual(solver.joinArray(), validPuzzles[i][1]);
    }
  });
});
