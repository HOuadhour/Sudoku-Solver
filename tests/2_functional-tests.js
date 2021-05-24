const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const Solver = require("../controllers/sudoku-solver.js");
const validPuzzles = require("../controllers/puzzle-strings").puzzlesAndSolutions;

chai.use(chaiHttp);

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", done => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: validPuzzles[0][0],
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "solution");
        assert.deepEqual(res.body.solution, validPuzzles[0][1]);
      });
    done();
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", done => {
    chai
      .request(server)
      .post("/api/solve")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.deepEqual(res.body.error, "Required field missing");
      });
    done();
  });

  test("Solve a puzzle with invalid characters: POST request to /api/solve", done => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: "x".repeat(81),
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.deepEqual(res.body.error, "Invalid characters in puzzle");
      });
    done();
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", done => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: "1".repeat(80),
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.deepEqual(res.body.error, "Expected puzzle to be 81 characters long");
      });
    done();
  });

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", done => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: "1".repeat(81),
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.deepEqual(res.body.error, "Puzzle cannot be solved");
      });
    done();
  });

  test("Check a puzzle placement with all fields: POST request to /api/check", done => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A1",
        value: "7",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "valid");
        assert.notProperty(res.body, "conflict");
        assert.isTrue(res.body.valid);
      });
    done();
  });

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", done => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A1",
        value: "2",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.isArray(res.body.conflict);
        assert.equal(res.body.conflict.length, 1);
        assert.equal(res.body.conflict[0], "region");
        assert.isFalse(res.body.valid);
      });
    done();
  });

  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", done => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A1",
        value: "4",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.isArray(res.body.conflict);
        assert.equal(res.body.conflict.length, 2);
        assert.equal(res.body.conflict[0], "column");
        assert.equal(res.body.conflict[1], "region");
        assert.isFalse(res.body.valid);
      });
    done();
  });

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", done => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A1",
        value: "5",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.isArray(res.body.conflict);
        assert.equal(res.body.conflict.length, 3);
        assert.equal(res.body.conflict[0], "row");
        assert.equal(res.body.conflict[1], "column");
        assert.equal(res.body.conflict[2], "region");
        assert.isFalse(res.body.valid);
      });
    done();
  });

  test("Check a puzzle placement with missing required fields: POST request to /api/check", done => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.deepEqual(res.body.error, "Required field(s) missing");
      });
    done();
  });

  test("Check a puzzle placement with invalid characters: POST request to /api/check", done => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..X..",
        coordinate: "A1",
        value: "7",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.deepEqual(res.body.error, "Invalid characters in puzzle");
      });
    done();
  });

  test("Check a puzzle placement with incorrect length: POST request to /api/check", done => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6",
        coordinate: "A1",
        value: "7",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.deepEqual(res.body.error, "Expected puzzle to be 81 characters long");
      });
    done();
  });

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", done => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A15",
        value: "7",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.deepEqual(res.body.error, "Invalid coordinate");
      });
    done();
  });

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", done => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        coordinate: "A1",
        value: "70",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.deepEqual(res.body.error, "Invalid value");
      });
    done();
  });
});
