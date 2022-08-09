"use strict";
const secretCombinationsEl = document.querySelectorAll(".secret-combination");
const combinationRowEl = document.querySelector(".question-mark");
const pickerBtn = document.querySelectorAll(".picker");
const guessingCells = document.querySelectorAll(".guessing-cell");
const colorCells = document.querySelectorAll(".color-cell");
const checkRowBtns = document.querySelectorAll(".check-button");
const rows = document.querySelectorAll(".guessing-row");
const colorRow = document.querySelectorAll(".color-row");
const winCells = document.querySelectorAll(".win-cell");
const score = document.querySelector(".currentScore");
const restartBtn = document.getElementById("restart");

const ANGULAR = "background-angular";
const C_S_S = "background-css";
const REACT = "background-react";
const JAVA_SCRIPT = "background-javascript";

const technologies = [ANGULAR, C_S_S, REACT, JAVA_SCRIPT];
let currentCell = -1;
let currentColorCell = 0;
let currentRow = -1;
let currentScore = 0;
let highScore = 0;
const maxCellLen = 24;
let rowCellLength = 4;
let secret = [];
let secretMap = {};
let guess = [];

//START THE GAME
const start = function () {
  generateCombination();
  solutionTester.fillSecretMap(secret);
  displayClickedTechnology();
  deleteChoosenTechnology();
  //check answer
  checkButton();
};

// GENERATE SECRET COMBINATION
const generateCombination = function () {
  for (let i = 0; i < rowCellLength; i++) {
    let number = Math.trunc(Math.random() * rowCellLength);
    secret.push(technologies[number]);
  }
  console.log(secret);
};

const handleAddingTech = function (e, choosenTechnology) {
  if (guess.length < rowCellLength) {
    let elClass = e.target.className;
    currentCell++;
    //takes the choosen tech class
    for (let i = 0; i < technologies.length; i++) {
      if (elClass.includes(technologies[i])) {
        choosenTechnology = technologies[i];
      }
    }
    //adds choosen classes to the guess(answer) array
    guess.push(choosenTechnology);

    // filling the cells
    if (currentCell < maxCellLen) {
      guessingCells[currentCell].classList.add(choosenTechnology);
    }

    //tracking the current row
    if (currentCell % rowCellLength == 0) {
      currentRow++;
    }
  }
};

//DISPLAY CHOOSEN TECHNOLOGY
const displayClickedTechnology = function () {
  for (let i = 0; i < pickerBtn.length; i++) {
    //let choosenTechnology = "";
    pickerBtn[i].addEventListener("click", handleAddingTech);
  }
};

const handleBackspaceDeletion = function (e) {
  if (guess.length !== 0) {
    console.log(e.key);
    if (e.key === "Backspace") {
      guessingCells[currentCell].classList.remove(
        JAVA_SCRIPT,
        ANGULAR,
        C_S_S,
        REACT
      );
      guess.pop();
      currentCell--;
      if (
        currentCell == -1 ||
        currentCell == 3 ||
        currentCell == 7 ||
        currentCell == 11 ||
        currentCell == 15 ||
        currentCell == 19
      ) {
        currentRow--;
      }
    }
  }
};

// DELETING THE ANSWER
const deleteChoosenTechnology = function () {
  document.addEventListener("keydown", handleBackspaceDeletion);
};

//OBJECT FOR STORING RESULT
const result = {
  green: 0,
  red: 0,
  white: 0,
  green_indexes: {},
  value_counter: {},
  increment_value: function (value) {
    if (value in this.value_counter) {
      this.value_counter[value] += 1;
    } else {
      this.value_counter[value] = 1;
    }
  },
};

//OBJECT FOR ANSWER CHECK
const solutionTester = {
  fillSecretMap: function (secret) {
    for (let i = 0; i < secret.length; i++) {
      if (secret[i] in secretMap) {
        secretMap[secret[i]] += 1;
      } else {
        secretMap[secret[i]] = 1;
      }
    }
  },
  testGreen: function (guess) {
    for (let i = 0; i < secret.length; i++) {
      if (guess[i] != secret[i]) continue;
      result.green += 1;
      result.green_indexes[i] = true;
      result.increment_value(guess[i]);
    }
  },
  testRed: function (guess) {
    for (let i = 0; i < guess.length; i++) {
      if (i in result.green_indexes) continue;
      if (!(guess[i] in secretMap)) continue;
      if (result.value_counter[guess[i]] >= secretMap[guess[i]]) continue;
      result.red += 1;
      result.increment_value(guess[i]);
    }
  },
  testWhite: function () {
    result.white = secret.length - result.green - result.red;
  },
};

// DISPLAY GREEN/RED/WHITE CELLS
const displayColorCells = function () {
  for (let i = 0; i < result.green; i++) {
    colorRow[currentRow].children[i].style.backgroundColor = "#29fd0d";
    colorRow[currentRow].children[i].style.boxShadow =
      "inset 5px 5px 10px #1db409, inset -5px -5px 10px #35ff11";
  }
  for (let i = 0; i < result.red; i++) {
    colorRow[currentRow].children[result.green + i].style.backgroundColor =
      "#fd0d0d";
    colorRow[currentRow].children[result.green + i].style.boxShadow =
      "inset 5px 5px 10px #b40909, inset -5px -5px 10px #ff1111";
  }
  if (result.green < 4) {
    currentScore++;
    score.textContent = `Number of attempts : ${currentScore}`;
    console.log(currentScore);
  }
};

//DISPLAY CORRECT COMBINATION IN POP UP
const displayCorrectCombination = function () {
  for (let i = 0; i < winCells.length; i++) {
    winCells[i].classList.add(`${secret[i]}`);
  }
};

// DISPLAY WIN/GAME OVER MESSAGE
const displayWinOrGameOver = function (message) {
  document.querySelector(".modal").classList.remove("hidden");
  document.querySelector(".overlay").classList.remove("hidden");
  document.querySelector(
    ".modal-title"
  ).textContent = `${message}  Number of attempts : ${currentScore + 1}`;
  document.querySelector(
    "attempts"
  ).classList.textContent = ` Number of attempts : ${currentScore + 1}`;
  displayCorrectCombination();
};

//CHECKING THE GAME STATUS WIN/GAME OVER
const checkGameStatus = function () {
  if (result.green == rowCellLength) {
    displayWinOrGameOver("🎉 Correct combination ! 🎉");
    renderConfetti();
  } else if (currentCell >= 23 && result.green < rowCellLength) {
    displayWinOrGameOver("💥 Game over 💥");
  }
};

//RESET VALUES FOR NEXT ROW
const resetForNextRow = function () {
  if (rows[currentRow].childElementCount == rowCellLength) {
    result.green = 0;
    result.red = 0;
    result.white = 0;
    result.green_indexes = {};
    result.value_counter = {};
    guess = [];
  }
};

// PROVERA ODGOVORA, PRIKAZ REZULTATA I STATUSA IGRE
const handleCheckAnswer = function () {
  if (guess.length < rowCellLength) {
    alert("Please fill out all cells !" + guess.length);
  } else if (guess.length > rowCellLength) {
    alert("The previous row is not checked");
  } else {
    solutionTester.testGreen(guess);
    solutionTester.testRed(guess);
    solutionTester.testWhite();
    displayColorCells();
    checkGameStatus();
    resetForNextRow();
  }
};

// ADDING EVENT LISTENER ON '?' BUTTON
const checkButton = function () {
  for (let i = 0; i < checkRowBtns.length; i++) {
    checkRowBtns[i].addEventListener("click", handleCheckAnswer);
  }
};
//reset functions
const removeModal = function () {
  document.querySelector(".modal").classList.add("hidden");
  document.querySelector(".overlay").classList.add("hidden");
};

const setUpStartValues = function () {
  currentCell = -1;
  currentColorCell = 0;
  currentRow = -1;
  secret = [];
  secretMap = {};
  guess = [];
  currentScore = 0;
  score.textContent = `Number of attempts : ${currentScore}`;
};

const deleteGuessingFields = function () {
  for (let i = 0; i < guessingCells.length; i++) {
    guessingCells[i].classList.remove(JAVA_SCRIPT, ANGULAR, C_S_S, REACT);
  }
};

const deleteColorCells = function () {
  for (let i = 0; i < colorCells.length; i++) {
    colorCells[i].style.backgroundColor = "white";
    colorCells[i].style.boxShadow =
      "inset 5px 5px 11px #d4d4d4, inset -5px -5px 11px #ffffff";
  }
};

const resetResultObj = function () {
  result.green = 0;
  result.red = 0;
  result.white = 0;
  result.green_indexes = {};
  result.value_counter = {};
};

const updateCombination = function () {
  for (let i = 0; i < winCells.length; i++) {
    winCells[i].classList.remove(JAVA_SCRIPT, ANGULAR, C_S_S, REACT);
  }

  console.log("tajna kombinacija -- " + secret);
  for (let i = 0; i < winCells.length; i++) {
    winCells[i].classList.add(`${secret[i]}`);
  }
};

const handleReset = function () {
  removeModal();
  setUpStartValues();
  deleteGuessingFields();
  deleteColorCells();
  resetResultObj();
  generateCombination();
  solutionTester.fillSecretMap(secret);
  checkButton();
  updateCombination();
};

const resetGame = function () {
  restartBtn.addEventListener("click", handleReset);
};

// RENDER CONFETTI
const renderConfetti = function () {
  var confettiSettings = { target: "conffetes" };
  var confetti = new ConfettiGenerator(confettiSettings);
  confetti.render();
};

start();
resetGame();
