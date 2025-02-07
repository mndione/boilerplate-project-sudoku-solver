const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

suite('Unit Tests', () => {
  //#1
  test('valid puzzle string of 81 characters', () => {
    assert.isTrue(solver.validatePuzzleLength('135762984946381257728459613694517832812936745357824196473298561581673429269145378'));
  });

  //#2
  test('puzzle string with invalid characters', () => {
    assert.isFalse(solver.validatePuzzleCharacters('135762984946381257728459613694517832812936745357824196473298561581673429269xxx378'));
  });

  //#3
  test('not 81 char length', () => {
    assert.isFalse(solver.validatePuzzleLength('135762984946381257728459613694517832812936745357824196473298561581673429269378'));
  });

  //#4
  test('valid row placement',  () => {
    assert.isTrue(solver.checkRowPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','7'));
  });

  //#5
  test('invalid row placement',  () => {
    assert.isFalse(solver.checkRowPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','D','2','8'));
  });

  //#6
  test('valid col placement',  () => {
    assert.isTrue(solver.checkColPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','7'));
  });

  //#7
  test('invalid col placement',  () => {
    //console.log(solver.checkColPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','6'));
    assert.isFalse(solver.checkColPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','6'));
  });

  //#8
  test('valid reg placement',  () => {
    assert.isTrue(solver.checkRegionPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','6'));
  });

  //#9
  test('invalid reg placement',  () => {
    assert.isFalse(solver.checkRegionPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..','A','1','2'));
  });

  //#10
  test('solve valid puzzle str',   () => {
    assert.equal(solver.solve('135762984946381257728459613694517832812936745357824196473298561581673429269145378'),'135762984946381257728459613694517832812936745357824196473298561581673429269145378');
  });

  //#11
  test('fail solver invalid puzzle str', () => {
    assert.isFalse(solver.solve('135162984946381257728459613694517832812936745357824196473298561581673429269145378'));
  });

  //#12
  test('solve solution', () => {
    assert.equal(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'),'135762984946381257728459613694517832812936745357824196473298561581673429269145378');
  });
});
