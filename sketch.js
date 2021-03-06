/*
 * This is an attempt to make a customisable CA.
 * Provides options to customize no. of cell states, initial state, & the rules.
 * Each run demands all the options to be fulfilled
 */

let w; // cell dimensions
let columns; // # of columns in canvas
let rows; // # of rows in canvas
let board; // a 2D array to keep track of the cell data
let next; // additional 2D array to be used for swapping data
var caType = "gameOfLife";
var initState;
let fr;

function setup() {
  createCanvas(.95*displayWidth, .8*displayHeight);
  setupGrid();
  frameRate(fr.value());
}

function setParam(){
  // determine cell dimensions
  w = createSlider(5, 50, 5);
  w.position(20, 10);
  // Calculate columns and rows
  columns = floor((.95*displayWidth) / w.value());
  rows = floor((.8*displayHeight) / w.value());
  // comboBox for initial state
  initState = createSelect();
  initState.position(20, 50);
  initState.option("(i*j)%2==0");
  initState.option("i%2==0 && j%2!=0");
  initState.option("randomised");

  // manage frame rate
  fr = createSlider(1, 60, 20);
  fr.position(20, 30);
}

function setupGrid(){
  setParam();
  // Wacky way to make a 2D array is JS
  board = new Array(columns);
  for (let i = 0; i < columns; i++) {
    board[i] = new Array(rows);
  }

  // Going to use multiple 2D arrays and swap them
  next = new Array(columns);
  for (i = 0; i < columns; i++) {
    next[i] = new Array(rows);
  }
  initGen(); // to fill up the canvas in the initial state
}

function draw() {
  background(255);
  updateGrid();
  frameRate(fr.value());
  represent();
}

// reset board when mouse is pressed
function mousePressed() {
  initGen();
}

// to intiate intial state of each cell corresponding to the possible states
function initGen(){
  var n = possibleStates();
  if(initState.value()=="randomised")
  {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        // Lining the edges with 0s
        if (i == 0 || j == 0 || i == columns - 1 || j == rows - 1) board[i][j] = 0;
        // Filling the rest randomly
        else board[i][j] = floor(random(n));  // using processing's random function
        next[i][j] = 0;
      }
    }
  }
  else if(initState.value()=="(i*j)%2==0")
  {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        if((i*j)%2==0){board[i][j]=1;}
        else board[i][j] = 0;
        next[i][j] = 0;
      }
    }
  }
  else if(initState.value()=="i%2==0 && j%2!=0")
  {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        if((i%j)%2==0){board[i][j]=1;}
        else board[i][j] = 0;
        next[i][j] = 0;
      }
    }
  }
}

// to define all possible states of a cell corresponding to each CA type
function possibleStates(){
  if(caType=="gameOfLife"){
    return 2;
  }
  
}

// to update each cell data corresponding to the CA rule
function updateGrid(){
  if(caType=="gameOfLife"){
    // Loop through every spot in our 2D array and check spots neighbors
    for (let x = 1; x < columns - 1; x++) {
      for (let y = 1; y < rows - 1; y++) {
        // Add up all the states in a 3x3 surrounding grid
        let neighbors = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            neighbors += board[x + i][y + j];
          }
        }
  
        // A little trick to subtract the current cell's state since
        // we added it in the above loop
        neighbors -= board[x][y];
        // Rules of Life
        if ((board[x][y] == 1) && (neighbors < 2)) next[x][y] = 0; // Loneliness
        else if ((board[x][y] == 1) && (neighbors > 3)) next[x][y] = 0; // Overpopulation
        else if ((board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1; // Reproduction
        else next[x][y] = board[x][y]; // Stasis
      }
    }
    swap();
  }
}

// to represent the instantaneous cell states in a tangible form
function represent(){
  // update columns and rows
  columns = floor((.95*displayWidth) / w.value());
  rows = floor((.8*displayHeight) / w.value());
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      fill(255-floor(255*board[i][j]/(possibleStates()-1)));
      stroke(0);
      rect(i * w.value(), j * w.value(), w.value() - 1, w.value() - 1);
    }
  }
}

function swap() {
  let temp = board;
  board = next;
  next = temp;
}

