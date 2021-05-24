const math = require("mathjs");

function validateRow(row) {
  const rows = "ABCDEFGHI";
  row = row.toUpperCase();
  if (rows.includes(row) && row.length === 1) {
    return {
      status: true,
      value: rows.indexOf(row),
    };
  }
  return {
    status: false,
  };
}

function validateCol(col) {
  const cols = "123456789".split("");
  col = new String(col).valueOf();
  if (cols.includes(col) && col.length === 1) {
    return {
      status: true,
      value: cols.indexOf(col),
    };
  }
  return {
    status: false,
  };
}

function validateVal(value) {
  const vals = "123456789".split("");
  value = new String(value).valueOf();
  if (vals.includes(value) && value.length === 1) {
    return true;
  }
  return false;
}

function splitCoord(pos) {
  // position example A1, B5, I9,
  // Split even if it is invalid like X0
  if (pos.length === 2) {
    return {
      status: true,
      row: pos[0],
      col: pos[1],
    };
  }
  return {
    status: false,
  };
}

function checkCoords(coord, value) {
  const { status, row, col } = splitCoord(coord);

  if (!status) {
    return { error: "Invalid coordinate" };
  }

  const validRow = validateRow(row);
  const validCol = validateCol(col);

  if (!validRow.status || !validCol.status) {
    return { error: "Invalid coordinate" };
  }

  if (!validateVal(value)) {
    return { error: "Invalid value" };
  }

  return {
    error: false,
    row: validRow.value,
    col: validCol.value,
  };
}

function checkRowConflicts(puzzleArray, row, col, value) {
  for (let i = 0; i < 9; i++) {
    if (puzzleArray[row][i] == value && col !== i) {
      return true;
    }
  }
  return false;
}

function checkColConflicts(puzzleArray, row, col, value) {
  for (let i = 0; i < 9; i++) {
    if (puzzleArray[i][col] == value && row !== i) {
      return true;
    }
  }
  return false;
}

function checkRegionConflicts(puzzleArray, row, col, value) {
  const xAxis = Math.floor(col / 3);
  const yAxis = Math.floor(row / 3);

  for (let i = yAxis * 3; i < yAxis * 3 + 3; i++) {
    for (let j = xAxis * 3; j < xAxis * 3 + 3; j++) {
      if (puzzleArray[i][j] == value && (row !== i || col !== j)) return true;
    }
  }
  return false;
}

class SudokuSolver {
  constructor(puzzleString = "") {
    this.puzzleString = puzzleString;
    this.puzzleArray = this.splitPuzzle();
  }

  validatePuzzle() {
    if (this.puzzleString.length != 81) return -1;
    else if (!this.puzzleString.match(/^([1-9\.]+)$/)) return -2;
    return 0;
  }

  splitPuzzle() {
    if (this.validatePuzzle() === 0) {
      // split string to 9x9 array
      return math.reshape(this.puzzleString.split(""), [9, 9]);
    }
    return null;
  }

  joinArray() {
    return math.reshape(this.puzzleArray, [81]).join("");
  }

  findEmpty() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.puzzleArray[row][col] === ".") {
          return [row, col];
        }
      }
    }
    return null;
  }

  check(value, coord, pos = false) {
    const conflicts = [];

    if (pos === false) {
      const result = checkCoords(coord, value);
      if (result.error !== false) {
        return result;
      }
      const row = result.row;
      const col = result.col;
      if (checkRowConflicts(this.puzzleArray, row, col, value)) conflicts.push("row");
      if (checkColConflicts(this.puzzleArray, row, col, value)) conflicts.push("column");
      if (checkRegionConflicts(this.puzzleArray, row, col, value)) conflicts.push("region");
    } else {
      const row = coord[0];
      const col = coord[1];
      if (checkRowConflicts(this.puzzleArray, row, col, value)) conflicts.push("row");
      if (checkColConflicts(this.puzzleArray, row, col, value)) conflicts.push("column");
      if (checkRegionConflicts(this.puzzleArray, row, col, value)) conflicts.push("region");
    }

    if (conflicts.length === 0) {
      return { valid: true };
    }
    return { valid: false, conflict: conflicts };
  }

  solve() {
    for (let val = 1; val <= 9; val++) {
      const empty = this.findEmpty();
      if (empty === null) return true;

      const row = empty[0];
      const col = empty[1];
      if (this.check(val + "", [row, col], true).valid) {
        this.puzzleArray[row][col] = val + "";

        if (this.solve()) return true;
        this.puzzleArray[row][col] = ".";
      }
    }
    return false;
  }

  isSolved() {
    // check if we have all digits in every row
    for (let row = 0; row < 9; row++) {
      const line = this.puzzleArray[row].join("");
      if (!line.match(/^[1-9]{9}$/)) return false;
    }

    // check if we have all digits in every column
    let digits = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = this.puzzleArray[row][col];
        digits.push(+value);
      }
      digits.sort((a, b) => a - b);
      if (digits.join("") !== "123456789") return false;
      digits = [];
    }
    return true;
  }
}

module.exports = SudokuSolver;
