"use strict";

const secretCombinationsEl = document.querySelectorAll(".secret-combination");
const combinationRowEl = document.querySelector(".question-mark");
const pickerBtn = document.querySelectorAll(".picker");
const guessingCells = document.querySelectorAll(".guessing-cell");
const colorCells = document.querySelectorAll(".color-cell");
const checkRowBtn = document.querySelectorAll(".check-button");
const rows = document.querySelectorAll(".guessing-row");
const colorRow = document.querySelectorAll(".color-row");

const ANGULAR = "background-angular";
const C_S_S = "background-css";
const REACT = "background-react";
const JAVA_SCRIPT = "background-javascript";
let currentCell = -1;
let currentColorCell = 0;
let currentRow = -1;
let maxCellLen = 24;
let rowCellLen = 4;
let secret = [];
let secretMap = {};
let guess = [];

//FUNKCIJA ZA GENERISANJE TAJNE KOMBINACIJE
const generateCombination = function () {
  for (let i = 0; i < 4; i++) {
    let number = Math.trunc(Math.random() * rowCellLen) + 1;
    switch (number) {
      case 1:
        secret.push(ANGULAR);
        break;
      case 2:
        secret.push(REACT);
        break;
      case 3:
        secret.push(JAVA_SCRIPT);
        break;
      case 4:
        secret.push(C_S_S);
        break;
    }
  }
};

// PRIKAZ GENERISANE TAJNE KOMBINACIJE
const displaySecretCombination = function () {
  // prikazuje dobitnu kombinaciju umesto znaka pitanja
  for (let i = 0; i < secretCombinationsEl.length; i++) {
    combinationRowEl.classList.remove("row-0");
    secretCombinationsEl[i].classList.add(`${secret[i]}`);
  }
};

//ODABIR TEHNOLOGIJA / POPUNJAVANJE REDA ZA NAGADJANJE
const displayClickedTechnology = function () {
  for (let i = 0; i < pickerBtn.length; i++) {
    let choosenClass;
    pickerBtn[i].addEventListener("click", function (e) {
      let elClass = e.target.className;
      currentCell++;

      if (elClass.includes(ANGULAR)) {
        choosenClass = ANGULAR;
      } else if (elClass.includes(REACT)) {
        choosenClass = REACT;
      } else if (elClass.includes(C_S_S)) {
        choosenClass = C_S_S;
      } else if (elClass.includes(JAVA_SCRIPT)) {
        choosenClass = JAVA_SCRIPT;
      }
      console.log(choosenClass);
      //uzima kombinacju trenutnog reda
      guess.push(choosenClass);
      //console.log('Kombinacija trenutnog reda : '+guess);

      // popunjavanje redova
      if (currentCell < maxCellLen) {
        guessingCells[currentCell].classList.add(choosenClass);
      }
      if (currentCell % rowCellLen == 0) {
        currentRow++;
      }
     console.log('celija   ' +currentCell);
     console.log('red   ' +currentRow)

     
    });
  }
};

// BRISANJE ODABIRA
const deleteChoosenTechnology = function(){
  document.addEventListener('keydown', function(e){ //kada se event desi mozemo imati pristup objektu eventa
    console.log(e.key);
    if(e.key === 'Backspace'){
      console.log('RADI')
      guessingCells[currentCell].classList.remove(JAVA_SCRIPT,ANGULAR,C_S_S,REACT);
      currentCell--;
    }
    });
}

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
        //console.log('Nalazi se')
        secretMap[secret[i]] += 1;
      } else {
        // console.log("Ne nalazi se")
        secretMap[secret[i]] = 1;
      }
    }
  },
  // uzima kombinaciju koju unosi korisnik, odnosno pogadja i na njoj testira zelene
  testGreen: function (guess) {
    for (let i = 0; i < secret.length; i++) {
      if (guess[i] != secret[i]) {
        //ukoliko se ne nalaze iste vrednosti na istim indeksima preskoci ih
        continue;
      } else {
        result.green += 1;
        result.green_indexes[i] = true;
        result.increment_value(guess[i]);
      }
    }
  },
  // testiranje crvenih
  testRed: function (guess) {
    for (let i = 0; i < guess.length; i++) {
      if (i in result.green_indexes) {
        console.log(`index ${i} se nalazi medju zelenim indeksima`);
        continue;
      } else if (!(guess[i] in secretMap)) {
        console.log(guess[i] + " se ne nalazi u tajnoj kombinaciji uopste");
        continue;
      }
      //else if(!(guess[i] in result.value_counter)){
      // result.value_counter[guess[i]] = 1;
      //}
      else if (result.value_counter[guess[i]] >= secretMap[guess[i]]) {
        continue;
      } else {
        result.red += 1;
        result.increment_value(guess[i]);
      }
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
    colorRow[currentRow].children[i].style.backgroundColor = "green";
  }
  for (let i = 0; i < result.red; i++) {
    colorRow[currentRow].children[result.green + i].style.backgroundColor =
      "red";
  }
};

//PROVERA STATUSA IGRE
const checkGameStatus = function () {
  console.log("Funkcija je pozvana");
  if (result.green == 4) {
    document.getElementById("title").textContent = "🎉 Correct combination ! 🎉";
    for (let i = 0; i < checkRowBtn.length; i++) {
      checkRowBtn[i].removeEventListener("click", checkAnswer);
    }
  } else if (currentCell >= maxCellLen && result.green < 4) {
    document.getElementById("title").textContent = "💥 Game over 💥";
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
    console.log(guess);
    console.log("OBJEKAT RESULT");
    console.log(result);
  }
};

// PROVERA ODGOVORA, PRIKAZ REZULTATA I STATUSA IGRE
const checkAnswer = function () {
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
};

// --- event listener klikom na dugme '?' ---
const checkButton = function () {
  for (let i = 0; i < checkRowBtn.length; i++) {
    checkRowBtn[i].addEventListener("click", checkAnswer);
  }

};

//POKRETANJE IGRE
const start = function () {
  // generise kombinaciju
  generateCombination();
  console.log(secret);
  //popunjavanje mape
  solutionTester.fillSecretMap(secret);
  console.log(" --- TAJNA MAPA -- ");
  console.log(secretMap);
  console.log(" ---------------------");
  // prikazuje kombinaciju
  displaySecretCombination();
  // funkcija za biranje polja
  displayClickedTechnology();
  deleteChoosenTechnology();
  //funkcija za proveru odgovora
  checkButton();
};

start();
