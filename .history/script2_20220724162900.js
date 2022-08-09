"use strict";

const secretCombinationsEl = document.querySelectorAll(".secret-combination");
const combinationRowEl = document.querySelector(".question-mark");
const pickerBtn = document.querySelectorAll(".picker");
const emptyCell = document.querySelectorAll(".empty");
const checkRowBtn = document.querySelectorAll(".check-button");
const rows = document.querySelectorAll(".guessing-row");
const empties = document.querySelectorAll(".empty");
const guessingCells = document.querySelectorAll(".guessing-cell");
const colorCells = document.querySelectorAll(".color-cell");
const colorCellsRows = document.querySelectorAll(".color-row");
//kombinacija reda
let currentRowCombination = [];
let green = [];
let red = [];
let white = [];
let currentColorCell = -1;
const ANGULAR = "background-angular";
const C_S_S = 'background-css';
const REACT = "background-react";
const JAVA_SCRIPT = "background-javascript";

//niz u koji se smesta tajna kombinacija
let secretCombination = {'background-angular': [0,1],
                         'background-css': [2],
                         'background-javascript': [3]
                        }; //tajna komb za proveru
let currentCell = -1;
let currentRow = -1;




//generisanje tajne kombinacije
// const generateCombination = function () {
//   for (let i = 0; i < 4; i++) {
//     let number = Math.trunc(Math.random() * 4) + 1;
//     //secretCombination.push(number);
//     switch (number) {
//       case 1:
//         secretCombination.push(ANGULAR);
//         break;
//       case 2:
//         secretCombination.push(REACT);
//         break;
//       case 3:
//         secretCombination.push(JAVA_SCRIPT);
//         break;
//       case 4:
//         secretCombination.push(C_S_S);
//         break;
//     }
//   }
// };

//generateCombination();
console.log(secretCombination);

// -------------- PRIKAZ GENERISANIH KOMBINACIJA ------------------------------------------------------
//promeniti posle
combinationRowEl.classList.remove("row-0");
// prikazuje dobitnu kombinaciju umesto znaka pitanja
//for (let i = 0; i < secretCombinationsEl.length; i++) {
//  secretCombinationsEl[i].classList.add(`${secretCombination[i]}`);
//}

// ------------ BIRANJE TEHNOLOGIJE I POPUNJAVANJE ODABRANE CELIJE SA ODABRANOM TEHNOLOGIJOM ----------
// uzima klasu kliknutog objekta, odnosno slicicu i cuva je u varijabli
// ova sekcija je dobra, nju ne diram
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
    currentRowCombination.push(choosenClass);
    //console.log('Kombinacija trenutnog reda : '+currentRowCombination);

    // ---------- popunjavanje redova -----------------------------------------------------
    if (currentCell < 24) {
      guessingCells[currentCell].classList.add(choosenClass);
      guessingCells[currentCell].classList.remove("empty");
      guessingCells[currentCell].classList.add("full");
    }
    if (currentCell % 4 == 0) {
        currentRow++;
    }
  });
}

// ------------- PROVERA UNETE KOMBINACJE --------------------------------------------------

// event listener za dugme za proveru kombinacije
for (let i = 0; i < checkRowBtn.length; i++) {
  checkRowBtn[i].addEventListener("click", function () {
    console.log("kliknuto");
   
    


    
    

    for (let i = 0; i < rows[currentRow].childNodes.length; i++) {
      currentRowCombination = [];
    }
  });
}
