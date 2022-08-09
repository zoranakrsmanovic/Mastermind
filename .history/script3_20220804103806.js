"use strict";
const secretCombinationsEl = document.querySelectorAll(".secret-combination");
const combinationRowEl = document.querySelector(".question-mark");
const pickerBtn = document.querySelectorAll(".picker");
const guessingCells = document.querySelectorAll(".guessing-cell");
const colorCells = document.querySelectorAll(".color-cell");
const checkRowBtn = document.querySelectorAll(".check-button");
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
let rowCellLen = 4;
let secret = [];
let secretMap = {};
let guess = [];

//POKRETANJE IGRE
const start = function () {
  // generise kombinaciju
  generateCombination();
  //popunjavanje mape
  solutionTester.fillSecretMap(secret);
  // prikazuje kombinaciju
  // displaySecretCombination();
  // biranje odgovora
  displayClickedTechnology();
  //brisanje odgovora
  deleteChoosenTechnology();
  //provera odgovora
  checkButton();
};

// GENERISANJE TAJNE KOMBINACIJE
const generateCombination = function () {
  for (let i = 0; i < rowCellLen; i++) {
    let number = Math.trunc(Math.random() * rowCellLen);
    secret.push(technologies[number]);
  }
  console.log("Tajna kombinacij -- " + secret);
};

// PRIKAZ GENERISANE TAJNE KOMBINACIJE
const displaySecretCombination = function () {
  // prikazuje dobitnu kombinaciju umesto znaka pitanja
  for (let i = 0; i < secretCombinationsEl.length; i++) {
    combinationRowEl.classList.remove("row-0");
    secretCombinationsEl[i].classList.add(`${secret[i]}`);
  }
  console.log("Tajna kombinacij -- " + secret);
};

//ODABIR TEHNOLOGIJA / POPUNJAVANJE REDA ZA NAGADJANJE
const displayClickedTechnology = function () {
  for (let i = 0; i < pickerBtn.length; i++) {
    let choosenTechnology = "";
    pickerBtn[i].addEventListener("click", function (e) {
      let elClass = e.target.className;
      //console.log(e);
      currentCell++;
      //uzima klase odabranog elementa
      for (let i = 0; i < technologies.length; i++) {
        if (elClass.includes(technologies[i])) {
          choosenTechnology = technologies[i];
        }
      }
      //uzima kombinacju trenutnog reda
      guess.push(choosenTechnology);
      console.log(choosenTechnology);

      // popunjavanje redova
      if (currentCell < maxCellLen) {
        guessingCells[currentCell].classList.add(choosenTechnology);
      }

      //pracenje trenutnog reda
      if (currentCell % rowCellLen == 0) {
        currentRow++;
      }
      console.log(`Trenutni red ${currentRow}, celija  - ${currentCell} `);
    });
  }
};

// BRISANJE ODABIRA --
const deleteChoosenTechnology = function () {
  document.addEventListener("keydown", function (e) {
    //kada se event desi mozemo imati pristup objektu eventa
    console.log(e.key);
    if (e.key === "Backspace") {
      guessingCells[currentCell].classList.remove(
        JAVA_SCRIPT,
        ANGULAR,
        C_S_S,
        REACT
      );
      guess.pop();
      console.log("Guess nakon backspace --- " + guess);

      if (
        currentCell == -1 ||
        currentCell == 3 ||
        currentCell == 7 ||
        currentCell == 11 ||
        currentCell == 15 ||
        currentCell == 19
      ) {
        currentCell--;
        //srediti u dinamicke vrednosti
        currentRow--;
      }
    }
  });
};

//OBJEKAT ZA REZULTAT
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

//OBJEKAT ZA PROVERU
const solutionTester = {
  // popunjava tajnu mapu sa generisanim brojevima, u ovom slucaju prosledjenim brojevima
  fillSecretMap: function (secret) {
    for (let i = 0; i < secret.length; i++) {
      if (secret[i] in secretMap) {
        secretMap[secret[i]] += 1;
      } else {
        secretMap[secret[i]] = 1;
      }
    }
  },
  // uzima kombinaciju koju unosi korisnik, odnosno pogadja i na njoj testira zelene
  testGreen: function (guess) {
    for (let i = 0; i < secret.length; i++) {
      if (guess[i] != secret[i]) continue;
      //ukoliko se ne nalaze iste vrednosti na istim indeksima preskoci ih
      result.green += 1;
      result.green_indexes[i] = true;
      result.increment_value(guess[i]);
    }
  },
  // testiranje crvenih
  testRed: function (guess) {
    for (let i = 0; i < guess.length; i++) {
      if (i in result.green_indexes) continue;
      if (!(guess[i] in secretMap)) continue; // ukoliko se uopste ne nalazi u kombinaciji, preskace se
      if (result.value_counter[guess[i]] >= secretMap[guess[i]]) continue; // ukoliko je izbrojano vise istih elemenata i broj je veci sa brojem koji se nalazi u tajnoj kombinaciji, nije zelena nego bela, preskace se
      result.red += 1;
      result.increment_value(guess[i]); //uvecava se broj odredjenog elementa
    }
  },
  // racunanje belih
  testWhite: function () {
    result.white = secret.length - result.green - result.red;
  },
};

// PRIKAZIVANJE REZULTATA
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

const displayCorrectCombination = function () {
  for (let i = 0; i < winCells.length; i++) {
    winCells[i].classList.add(`${secret[i]}`);
  }
};

// menjanje poruke
const displayWinOrGameOver = function (message) {
  document.querySelector(".modal").classList.remove("hidden");
  document.querySelector(".overlay").classList.remove("hidden");
  document.querySelector(
    ".modal-title"
  ).textContent = `${message} Number of attempts : ${currentScore}`;
  displayCorrectCombination();
};

//PROVERA STATUSA IGRE
const checkGameStatus = function () {
  if (result.green == rowCellLen) {
    displayWinOrGameOver("🎉 Correct combination ! 🎉");
    renderConfetti();
  } else if (currentCell >= 23 && result.green < rowCellLen) {
    displayWinOrGameOver("💥 Game over 💥");
  }
};

//RESETOVANJE VREDNOSTI ZA SLEDECI RED
const resetForNextRow = function () {
  // -- proveriti ovaj deo ---
  if (rows[currentRow].childElementCount == rowCellLen) {
    // setovanje pocetnih vrednosti za sledeci red
    result.green = 0;
    result.red = 0;
    result.white = 0;
    result.green_indexes = {};
    result.value_counter = {};
    guess = [];
  }
};

// PROVERA ODGOVORA, PRIKAZ REZULTATA I STATUSA IGRE
const checkAnswer = function () {
  console.log("Guess kombinacija u proveri" + guess);
  console.log(result.green + " zelene pre provere");
  console.log(result.red + " red pre provere");
  console.log(result.white + " bele pre provere");
  if (guess.length < rowCellLen) {
    alert("Please fill out all cells !" + guess.length);
  } else if (guess.length > rowCellLen) {
    alert("The previous row is not checked");
  } else {
    // testiranje zelenih
    solutionTester.testGreen(guess);
    console.log("Zelene - " + result.green);
    // testiranje crvenih
    solutionTester.testRed(guess);
    console.log("Crvene - " + result.red);
    console.log(result.value_counter);
    // testiranje belih
    solutionTester.testWhite();
    console.log("Bele - " + result.white);
    // bojenje krugova
    displayColorCells();
    // proverava da li je igra gotova
    checkGameStatus();
    //resetuje vrednosti na pocetno stanje radi provere sledeceg reda
    resetForNextRow();
  }
};

// --- event listener klikom na dugme '?' ---
const checkButton = function () {
  for (let i = 0; i < checkRowBtn.length; i++) {
    checkRowBtn[i].addEventListener("click", checkAnswer);
  }
};

const removeModal = function () {
  // 1. skloni pop up modal
  document.querySelector(".modal").classList.add("hidden");
  document.querySelector(".overlay").classList.add("hidden");
};

const setUpStartValues = function () {
  // 2. vrati currentRow i cell na pocetnu vrednost
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
  // 4. izbrisi sa svih celija sve clase sa tehnologijama
  for (let i = 0; i < guessingCells.length; i++) {
    guessingCells[i].classList.remove(JAVA_SCRIPT, ANGULAR, C_S_S, REACT);
  }
};

const deleteColorCells = function () {
  // 5. izbrisi color cells
  for (let i = 0; i < colorCells.length; i++) {
    colorCells[i].style.backgroundColor = "white";
    colorCells[i].style.boxShadow =
      "inset 5px 5px 11px #d4d4d4, inset -5px -5px 11px #ffffff";
  }
};

const resetResultObj = function () {
  // 5. vrati result obejekat na pocetno stanje
  result.green = 0;
  result.red = 0;
  result.white = 0;
  result.green_indexes = {};
  result.value_counter = {};
};

const handleReset = function () {
  removeModal();
  setUpStartValues();
  deleteGuessingFields();
  deleteColorCells();
  resetResultObj();
  // generise kombinaciju
  generateCombination();
  //popunjavanje mape
  solutionTester.fillSecretMap(secret);
  //provera odgovora
  checkButton();

  for (let i = 0; i < winCells.length; i++) {
    winCells[i].classList.remove(JAVA_SCRIPT, ANGULAR, C_S_S, REACT);
  }

  console.log("tajna kombinacija -- " + secret);
  for (let i = 0; i < winCells.length; i++) {
    winCells[i].classList.add(`${secret[i]}`);
  }
};

const resetGame = function () {
  restartBtn.addEventListener("click", handleReset);
};

// renferovanje konfeta
const renderConfetti = function () {
  var confettiSettings = { target: "conffetes" };
  var confetti = new ConfettiGenerator(confettiSettings);
  confetti.render();
};

start();
resetGame();
