"use strict";

const secretCombinationsEl = document.querySelectorAll(".secret-combination");
const combinationRowEl = document.querySelector(".question-mark");
const pickerBtn = document.querySelectorAll(".picker");
const pickerAngular = document.querySelector(".angular");
const pickerReact = document.querySelector(".react");
const pickerJavaScript = document.querySelector(".javascript");
const pickerCss = document.querySelector(".css");
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

//niz u koji se smesta tajna kombinacija
let secretCombination = ["background-angular","background-angular","background-css", "background-react"]; //tajna komb za proveru
let secretCombination2 = ['background-angular','background-angular','background-css', 'background-react'];
let currentCell = -1;
let currentRow = -1;

//generisanje tajne kombinacije
// const generateCombination = function () {
//   for (let i = 0; i < 4; i++) {
//     let number = Math.trunc(Math.random() * 4) + 1;
//     //secretCombination.push(number);
//     switch (number) {
//       case 1:
//         secretCombination.push("background-angular");
//         break;
//       case 2:
//         secretCombination.push("background-react");
//         break;
//       case 3:
//         secretCombination.push("background-javascript");
//         break;
//       case 4:
//         secretCombination.push("background-css");
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
for (let i = 0; i < secretCombinationsEl.length; i++) {
  secretCombinationsEl[i].classList.add(`${secretCombination[i]}`);
}

// ------------ BIRANJE TEHNOLOGIJE I POPUNJAVANJE ODABRANE CELIJE SA ODABRANOM TEHNOLOGIJOM ----------
// uzima klasu kliknutog objekta, odnosno slicicu i cuva je u varijabli
for (let i = 0; i < pickerBtn.length; i++) {
  let choosenClass;
  pickerBtn[i].addEventListener("click", function (e) {
    let elClass = e.target.className;
    currentCell++;

    if (elClass.includes("background-angular")) {
      choosenClass = "background-angular";
    } else if (elClass.includes("background-react")) {
      choosenClass = "background-react";
    } else if (elClass.includes("background-css")) {
      choosenClass = "background-css";
    } else if (elClass.includes("background-javascript")) {
      choosenClass = "background-javascript";
    }
    console.log(choosenClass);
    //uzima kombinacju trenutnog reda
    currentRowCombination.push(choosenClass);

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
    console.log(currentRowCombination);
    //kopira se niz da se originalni ne bi menjao
    let secretCombinationCopy = [...secretCombination];
    for (let i = 0; i < secretCombinationCopy.length; i++) {
      if (currentRowCombination[i] == secretCombinationCopy[i]) {
        console.log("PRAVA TEHNOLOGIJA NA PRAVOM MESTU - > green" + green);
        green.push(currentRowCombination[i]); // zelene donji red, radi
        // prati do koje celije za proveru je stiglo
        currentColorCell++;
        for (let i = 0; i < green.length; i++) {
          colorCells[currentColorCell].style.backgroundColor = "green";
        }
        if (green.length == 3) {
          document.getElementById("title").textContent =
            "🎉 Congratulations 🎉";
        }
      }
    }
    for (let i = 0; i < green.length; i++) {
      if (secretCombinationCopy.includes(green[i])) {
        let index = secretCombinationCopy.indexOf(green[i]);
        secretCombinationCopy.splice(index, 1);
      }
      if (currentRowCombination.includes(green[i])) {
        let index = currentRowCombination.indexOf(green[i]);
        currentRowCombination.splice(index, 1);
      }
    }
    for (let i = 0; i < currentRowCombination.length; i++) {
      if (currentRowCombination.includes(secretCombinationCopy[i])) {
        red.push(secretCombinationCopy[i]);
        console.log("PRAVA TEHNOLOGIJA NA POGRESNOM MESTU JE - red " + red);
        currentColorCell++;
        for (let i = 0; i < red.length; i++) {
          colorCells[currentColorCell].style.backgroundColor = "red";
        }
      } else {
        white.push(currentRowCombination[i]);
        console.log("Belo - POGRESNA TEHNOLOGIJA NA POGRESNOM MESTU" + white);
        currentColorCell++;
        for (let i = 0; i < white.length; i++) {
          colorCells[currentColorCell].style.backgroundColor = "white";
          colorCells[currentColorCell].style.border = "1 px solid red";
        }
      }
    }

    if (currentCell == 23 && green.length < 3) {
      document.getElementById("title").textContent = "💥 Game over 💥";
    }

    console.log("Tajna kombinacija + " + secretCombination);
    console.log("Tajna kombinacija kopija " + secretCombinationCopy);
    console.log("TRENUTNA CELIJA " + currentColorCell);

    for (let i = 0; i < rows[currentRow].childNodes.length; i++) {
      currentRowCombination = [];
      white = [];
      green = [];
      red = [];
    }
  });
}
