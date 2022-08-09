"use strict";

const secretCombinationsEl = document.querySelectorAll(".secret-combination");
const combinationRowEl = document.querySelector(".question-mark");
const pickerBtn = document.querySelectorAll(".picker");

const ANGULAR = "background-angular";
const C_S_S = 'background-css';
const REACT = "background-react";
const JAVA_SCRIPT = "background-javascript";
let currentCell = 0;
let secret = [];
let secretMap = {};
let guess = ['background-angular','background-angular','background-angular','background-angular'];

//generisanje tajne kombinacije
 const generateCombination = function () {
   for (let i = 0; i < 4; i++) {
     let number = Math.trunc(Math.random() * 4) + 1;
     //secretCombination.push(number);
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

 generateCombination();
 console.log(secret);

 const displaySecretCombination = function () {
   // prikazuje dobitnu kombinaciju umesto znaka pitanja
   for (let i = 0; i < secretCombinationsEl.length; i++) {
     combinationRowEl.classList.remove("row-0");
     secretCombinationsEl[i].classList.add(`${secret[i]}`);
   }
 };

 displaySecretCombination();

 const displayClickedTechnology = function(){
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
  
      // ---------- popunjavanje redova -----------------------------------------------------
      if (currentCell < 24) {
        guessingCells[currentCell].classList.add(choosenClass);
      }
      if (currentCell % 4 == 0) {
          currentRow++;
      }
    });
  }
 }



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
  testGreen: function (guess) {
    // uzima kombinaciju koju unosi korisnik, odnosno pogadja i na njoj testira zelene
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
  testRed: function (guess) {
    for (let i = 0; i < guess.length; i++) {
      if (i in result.green_indexes) {
        console.log(`index ${i} se nalazi medju zelenim indeksima`);
        continue;
      } else if (!(guess[i] in secretMap)) {
        console.log(guess[i] + " se ne nalazi u tajnoj kombinaciji uopste");
        continue;
      } else if (result.value_counter[guess[i]] >= secretMap[guess[i]]) {
        continue;
      } else {
        result.red += 1;
        result.increment_value(guess[i]);
      }
    }
  },
  testWhite: function () {
    result.white = secret.length - result.green - result.red;
  },
};

solutionTester.fillSecretMap(secret);
solutionTester.testGreen(guess);
console.log("Tajna mapa ->");
console.log(secretMap);
console.log("Tajni niz - " + secret);
console.log("Guess - " + guess);
console.log("Zelene - " + result.green);
console.log(result);
solutionTester.testRed(guess);
console.log("Crvene - " + result.red);
console.log(result.value_counter);
solutionTester.testWhite();
console.log("Bele - " + result.white);
