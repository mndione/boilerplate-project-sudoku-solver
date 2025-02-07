const { puzzlesAndSolutions } = require("./puzzle-strings");

class SudokuSolver {
  constructor(){
    this.validate = this.validate.bind(this);
    this.checkColPlacement = this.checkColPlacement.bind(this);
    this.checkRegionPlacement = this.checkRegionPlacement.bind(this);
    this.checkRowPlacement = this.checkRowPlacement.bind(this);
    this.column = this.column.bind(this);
    this.row = this.row.bind(this);
    this.solve = this.solve.bind(this);
    this.validateCoordinate = this.validateCoordinate.bind(this);
    this.validatePuzzle81 = this.validatePuzzle81.bind(this);
    this.validatePuzzleLength = this.validatePuzzleLength.bind(this);
    this.validateValue = this.validateValue.bind(this);
    this.validatePuzzleCharacters = this.validatePuzzleCharacters.bind(this);
    //console.log(this.solve('7.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'));
  }

  validateCoordinate(coordinate){
    if(!/^[A-I][1-9]$/.test(coordinate)) return false;
    return true;
  }

  validateValue(value){
    if(!/^[1-9]$/.test(value)) return false;
    return true;
  }

  validatePuzzleLength(puzzle){
    if(puzzle.length !== 81) return false;
    return true;
  }

  validatePuzzle81(puzzleString){
    if(!/[1-9]{81}/.test(puzzleString)) return false;
    return true;
  }

  validatePuzzleCharacters(puzzleString){
    if(!/^[1-9.]+$/.test(puzzleString)) return false;
    return true;
  }

  validate(puzzleString) {
    if(!this.validatePuzzle81(puzzleString)) return false;

    for(let i=0;i<81;i++){
      if(!this.checkRowPlacement(puzzleString, this.row(i), this.column(i), puzzleString.charAt(i)) || !this.checkColPlacement(puzzleString, this.row(i), this.column(i), puzzleString.charAt(i)) || !this.checkRegionPlacement(puzzleString, this.row(i), this.column(i), puzzleString.charAt(i)))
        return false;
    }
    //console.log("\n Sol: " + puzzleString + "\n");
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowIndex = {'A': 0, 'B': 9, 'C': 18, 'D': 27, 'E': 36, 'F': 45, 'G': 54, 'H': 63, 'I': 72};
    let rowValues = puzzleString.substring(rowIndex[row],rowIndex[row] + 9);
    rowValues = rowValues.substring(0, column-1) + rowValues.substring(column);
    if(rowValues.includes(value.toString())) {
      return false;
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let colValues = [];
    const rowIndex = {'A': 0, 'B': 9, 'C': 18, 'D': 27, 'E': 36, 'F': 45, 'G': 54, 'H': 63, 'I': 72};
    const colIndex = column - 1;
    for(let i=0;i<81;i=i+9) {
      if(rowIndex[row] + colIndex != colIndex + i)
        colValues.push(puzzleString.charAt(colIndex + i));
    }
     
    if(colValues.includes(value.toString())) return false;
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let regValues = [];
    switch(row){
      case 'A':
      case 'B':
      case 'C':
        if(column<4)
          regValues=[0,1,2,9,10,11,18,19,20];
        else if(column<7) 
          regValues=[3,4,5,12,13,14,21,22,23];
        else
          regValues=[6,7,8,15,16,17,24,25,26];
        break;
      case 'D':
      case 'E':
      case 'F':
        if(column<4)
          regValues=[27,28,29,36,37,38,45,46,47];
        else if(column<7) 
          regValues=[30,31,32,39,40,41,48,49,50];
        else
        regValues=[33,34,35,42,43,44,51,52,53];
       break;
      case 'G':
      case 'H':
      case 'I':
        if(column<4)
          regValues=[54,55,56,63,64,65,72,73,74];
        else if(column<7) 
          regValues=[57,58,59,66,67,68,75,76,77];
        else
        regValues=[60,61,62,69,70,71,78,79,80];
    }
    const rowIndex = {'A': 0, 'B': 9, 'C': 18, 'D': 27, 'E': 36, 'F': 45, 'G': 54, 'H': 63, 'I': 72};
    const colIndex = column - 1;
    //console.log(regValues.filter(el => el != rowIndex[row] + colIndex).map(el => puzzleString.charAt(el)).includes(value.toString()));
    if(regValues.filter(el => el != rowIndex[row] + colIndex).map(el => puzzleString.charAt(el)).includes(value.toString())) return false;
    return true;
  }
 
  column(index){
    return index % 9 + 1;
  }
 
  row(index){
    const rowMarks = 'ABCDEFGHI';
    const rowIndex = Math.floor(index / 9);
    return rowMarks.charAt(rowIndex);
  }

  solve(puzzleString) {
    
    if(this.validate(puzzleString)) return puzzleString;
    
    let nextIndex = puzzleString.search(/[.]/);
    if(nextIndex===-1) return false;

    for(let i=1; i<10; i++){
      if(this.checkColPlacement(puzzleString, this.row(nextIndex), this.column(nextIndex), i.toString()) 
        && this.checkRegionPlacement(puzzleString, this.row(nextIndex), this.column(nextIndex), i.toString()) 
        && this.checkRowPlacement(puzzleString, this.row(nextIndex), this.column(nextIndex), i.toString())){
        let puzzleStringNext = puzzleString.replace(/[.]/, i.toString());
        if(puzzleStringNext=this.solve(puzzleStringNext)) {
          //console.log(puzzleStringNext + "\n");
          return puzzleStringNext;
        }
      }
    }
    
    return false;
  }
}

module.exports = SudokuSolver;

