'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const coordinate = req.body.coordinate;
      const value = req.body.value;
      const puzzle = req.body.puzzle;
      if(coordinate === undefined || coordinate === '' || value === undefined || value === '' || puzzle === undefined || puzzle === ''){
        res.json({error: 'Required field(s) missing'});
        return;
      }
      if(!solver.validateCoordinate(coordinate)){
        res.json({error: 'Invalid coordinate'});
        return;
      }
      if(!solver.validateValue(value)){
        res.json({error: 'Invalid value'});
        return;
      }
      
      if(!solver.validatePuzzleLength(puzzle)){
        res.json({error: 'Expected puzzle to be 81 characters long'});
        return;
      }

      if(!solver.validatePuzzleCharacters(puzzle)){
        res.json({error: 'Invalid characters in puzzle'});
        return;
      }
      
      const checkRow = solver.checkRowPlacement(puzzle, coordinate.substring(0,1), coordinate.substring(1), value);
      const checkCol = solver.checkColPlacement(puzzle, coordinate.substring(0,1), coordinate.substring(1), value);
      const checkReg = solver.checkRegionPlacement(puzzle, coordinate.substring(0,1), coordinate.substring(1), value);
      let errors = [];
      if(!checkRow) errors.push("row");
      if(!checkCol) errors.push("column");
      if(!checkReg) errors.push("region");
      if(errors.length) {
        res.json({valid: false, conflict: errors});
        return;
      }
      res.json({valid: true});
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      if(puzzle === undefined || puzzle === '') {
        res.json({ error: 'Required field missing' });
        return ;
      }
      
      if(!solver.validatePuzzleLength(puzzle)){
        res.json({error: 'Expected puzzle to be 81 characters long'});
        return;
      }
      if(!solver.validatePuzzleCharacters(puzzle)){
        res.json({error: 'Invalid characters in puzzle'});
        return;
      }

      const puzzleSolution = solver.solve(puzzle);
      if(!puzzleSolution){
        res.json({ error: 'Puzzle cannot be solved' });
        return;
      }

      res.json({solution: puzzleSolution});
    });
};
