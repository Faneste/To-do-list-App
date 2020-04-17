// iskoristi underscore js
// mozes i animacije da ubacis sa animate
// nek samo dodaje boje razlicite za kategorije sa opcijom da ti menjas ako hoces // mogu za boje da ima meni umesto color wheel\
// neka dizajn za boje bude samo linija oko notes zbog tamne teme
// nek ima precrtani tekst ako je checkirano
// stavi dark i light mode samo za pozadinu // moze jedna okrugla ikonica i toggle
// moze broj kategorija i broj checkiranih i nechekiranih i datum zadnjeg unosa
// kategorija moze da ima informacije o broju notes u sebi datumu
// return moze da bude floating button sa fixed pozicijom
// neka nota bude malo duza od kategorije u zavisnosti od teksta
// neka note input ima border ruzicasti ili nesto slicno da se razlikuje
// neka prvo slovo bude veliko u inputu
// za dizajn moze neka trakasta pozadina posto izgleda prazno
// sredi foldere za fajlove, neka ikonice imaju poseban folder
// spoj css klase i id za category i note, kod se bespotrebno ponavlja
// nek se ne vidi back dugme u kategorijama / stavi u visibility function
// neka prikaze no notes yet ili categories
// neka notes kada se klikne na celo polje da checkmarkuje, da ne mora tacno na checkmark da se klikce
// neka ima loading screen za telefone sa logoom
let allNotesArr = []; let activeCategory; let categoryInput; let noteInput; let noteVisiblity = false;let darkTheme = false;

///////////////////// getting input ///////////////////////

// category input
document.getElementById("category__submitbutton").addEventListener("click", function(event){
  event.preventDefault();
  categoryInput = document.getElementById("category__textarea").value;
  categoryInput = categoryInput.charAt(0).toUpperCase() + categoryInput.slice(1);

  // time formatting, add zero if time is 10:2:22 for example
  time = new Date();
  let hours = (time.getHours()<10?'0':'') + time.getHours();
  let minutes = (time.getMinutes()<10?'0':'') + time.getMinutes();
  let seconds = (time.getSeconds()<10?'0':'') + time.getSeconds();
  // date formatting
  let dd = String(time.getDate()).padStart(2, '0');
  let mm = String(time.getMonth() + 1).padStart(2, '0');
  let yyyy = time.getFullYear();
  let date = dd + '/' + mm + '/' + yyyy;

  // if there's an text in input
  if (categoryInput !== "") {
    allNotesArr.push({
      categoryTitle:categoryInput,
      categoryTime: hours + ":" + minutes + ":" + seconds,
      categoryDate: date,
      categoryActive: false,
      categoryCheck: false,
      notes: []
    });
    buildCategory();
    buildNote();
    infoFunc();
  } else {
    // flash input if empty
    var t = setInterval(function () {
    var ele = document.getElementById("category__textarea");
      ele.style.visibility  = (ele.style.visibility  == "hidden" ? "" : "hidden");
    }, 100);
    setTimeout(function( ) { clearInterval( t ); }, 600);
  }
  document.getElementById("category__textarea").value = "";
});

// note input
document.getElementById("note__submitbutton").addEventListener("click", function(event){
  event.preventDefault();
  noteInput = document.getElementById("note__textarea").value;
  noteInput = noteInput.charAt(0).toUpperCase() + noteInput.slice(1);
  let noteTime = new Date();

  let noteInputObject = {
    noteText: noteInput,
    noteDate: noteTime.getHours() + ":" + noteTime.getMinutes() + ":" + noteTime.getSeconds(),
    noteCheck: false,
    noteActiveColor: "#d2315f",
    noteColors: ["#0060af", "#29b013", "#c51021", "#e87d0b"]
  }

  if (noteInput !== "") {
    for (var i = 0; i < allNotesArr.length; i++) {
      if (allNotesArr[i].categoryActive === true) {
        allNotesArr[i].notes.push(noteInputObject);
      }
    }
    buildCategory();
    buildNote();
    infoFunc();
  } else {
    // flash input if empty
    var t = setInterval(function () {
    var ele = document.getElementById("note__textarea");
      ele.style.visibility  = (ele.style.visibility  == "hidden" ? "" : "hidden");
    }, 100);
    setTimeout(function( ) { clearInterval( t ); }, 600);
  }
  document.getElementById("note__textarea").value = "";
});

///////////////////// building html ///////////////////////

// build category html
function buildCategory() {

  // deletes old html and builds a new updated one
  let nodeDelete = document.getElementsByClassName("category__container");
  // backwards loop bcs index of html element is changing with html coll.
  for (var i = nodeDelete.length - 1; i >= 0; i--) {
    // Remove first element (at [0]) repeatedly
    nodeDelete[0].remove();
  }

  allNotesArr.forEach((item, i) => {

    let categoryContainerMain = document.getElementById("categoryList");

    let categoryContainerSmall = document.createElement("div");
    categoryContainerSmall.classList.add("category__container");

    let clickDiv = document.createElement("div");
    clickDiv.classList.add("category__clickDiv");
    clickDiv.onclick = function() {
      // console.log(this.parentNode.children[2].children[0].innerHTML);
      for (var i = 0; i < allNotesArr.length; i++) {
        if (this.parentNode.children[2].children[0].innerHTML === allNotesArr[i].categoryTime) {
          // reset active category
          for (var j = 0; j < allNotesArr.length; j++) {
            allNotesArr[j].categoryActive = false;
          }
          // assign active category
          allNotesArr[i].categoryActive = true;
          buildNote();
        }
      }
      visibilityFunc();
      infoFunc();
    }

    let title = document.createElement("h2");
    title.innerHTML = item.categoryTitle;
    title.classList.add("category__title");

    let date = document.createElement("h3");
    date.innerHTML = `created at
      <span class="category__date__span">${item.categoryTime}</span>, on
      <span class="category__date__span">${item.categoryDate}</span>
      `;
    date.classList.add("category__date");

    let categoryInfo = document.createElement("h3");
    let noteNumber = 0; let noteCheck = 0;
    for (var k = 0; k < item.notes.length; k++) {
      noteNumber++;
      // sredi notechek, problem je undefined kad se ubaci druga nota u drugoj kategoriji
      // if (item.notes[i].noteCheck !== "undefined" && item.notes[i].noteCheck === true) {
      //     noteCheck++;
      // }
    };
    categoryInfo.innerHTML =
    `<span class="category__info__span">
    ${noteNumber}</span> notes /
    <span class="category__info__span">${noteCheck}</span> checked`;
    categoryInfo.classList.add("category__info");

    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.classList.add("category__checkbox");
    checkbox.checked = item.categoryCheck;
    checkbox.onclick = function() {
      for (var i = 0; i < allNotesArr.length; i++) {
        if (this.parentNode.children[2].children[0].innerHTML === allNotesArr[i].categoryTime) {
          allNotesArr[i].categoryCheck = !allNotesArr[i].categoryCheck;
        }
      }
      infoFunc();
    }

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<img class="deleteButtonSvg" src="deleteIcon.svg" alt="deleteSVG">';
    deleteButton.classList.add("category__delete");
    deleteButton.onclick = function () {
      for (var i = 0; i < allNotesArr.length; i++) {
        if (this.parentNode.children[2].children[0].innerHTML === allNotesArr[i].categoryTime) {
          let filteredArray = allNotesArr.filter((item) => item !== allNotesArr[i]);
          allNotesArr = filteredArray;
          buildCategory();
          infoFunc();
        }
      }
    };

    categoryContainerSmall.appendChild(clickDiv);
    categoryContainerSmall.appendChild(title);
    categoryContainerSmall.appendChild(date);
    categoryContainerSmall.appendChild(deleteButton);
    categoryContainerSmall.appendChild(checkbox);
    categoryContainerSmall.appendChild(categoryInfo); // changing order makes clicking not work for some reason
    categoryContainerMain.appendChild(categoryContainerSmall);
  });
}

function buildNote() {
  // deletes old html and builds a new updated one
  let nodeDelete = document.getElementsByClassName("note__container");
  // backwards loop bcs index of html element is changing with html coll.
  for (var i = nodeDelete.length - 1; i >= 0; i--) {
    // Remove first element (at [0]) repeatedly
    nodeDelete[0].remove();
  }

  for (var i = 0; i < allNotesArr.length; i++) {
    if (allNotesArr[i].categoryActive === true) {

      let notesArray = allNotesArr[i].notes;
      for (var j = 0; j < notesArray.length; j++) {

        let noteContainerMain = document.getElementById("noteList");

        let noteContainerSmall = document.createElement("div");
        noteContainerSmall.classList.add("note__container");
        noteContainerSmall.onclick = function() {
        }

        let title = document.createElement("h2");
        title.innerHTML = notesArray[j].noteText;
        title.classList.add("note__title");
        if (notesArray[j].noteCheck === true) {
          title.style.textDecoration = "line-through";
        }
        title.style.color = notesArray[j].noteActiveColor;

        let date = document.createElement("h3");
        date.innerHTML = `made at <span class="note__date__span">${notesArray[j].noteDate}</span>`;
        date.classList.add("note__date");

        let titleDateContainer = document.createElement("div");
        titleDateContainer.classList.add("note__titleDateContainer");
        titleDateContainer.appendChild(title);
        titleDateContainer.appendChild(date);

        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.classList.add("note__checkbox");
        checkbox.checked = notesArray[j].noteCheck;
        checkbox.onclick = function() {
          for (var i = 0; i < allNotesArr.length; i++) {
            if (allNotesArr[i].categoryActive === true) {

              let activeNotes = allNotesArr[i];
              let notesArray = allNotesArr[i].notes;

              for (var j = 0; j < notesArray.length; j++) {
                if (this.parentNode.children[1].children[1].children[0].innerHTML === notesArray[j].noteDate) {
                  notesArray[j].noteCheck = !notesArray[j].noteCheck;
                }
              }
            }
          }
          buildNote();
          infoFunc();
        }

        let colorButton = document.createElement("button");
        colorButton.innerHTML = '<img class="colorButtonSvg" src="colorIcon.svg" alt="colorSVG">';
        colorButton.classList.add("note__color");
        colorButton.onclick = function() {
          this.parentNode.children[4].style.display = this.parentNode.children[4].style.display === 'block' ? '' : 'block';
        }

        let colorButtonContainer = document.createElement("div");
        colorButtonContainer.classList.add("colorButtonContainer");
        colorButtonContainer.id = "noteDropdown";

        // building color divs to choose from
        for (var k = 0; k < notesArray[j].noteColors.length; k++) {
          let colorButtonColors = document.createElement("div");
          colorButtonColors.style.backgroundColor  = notesArray[j].noteColors[k];
          colorButtonColors.classList.add("colorButtonColors");
          colorButtonContainer.appendChild(colorButtonColors);
          colorButtonColors.onclick = function () {
            for (var l = 0; l < notesArray.length; l++) {
              if (this.parentNode.parentNode.children[1].children[1].children[0].innerHTML === notesArray[l].noteDate) {
                notesArray[l].noteActiveColor = this.style.backgroundColor;
              }
            }
            buildNote();
          }
        }

        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<img class="deleteButtonSvg" src="deleteIcon.svg" alt="deleteSVG">';
        deleteButton.classList.add("note__delete");
        deleteButton.onclick = function () {
          // console.log(this.parentNode.children[1].children[1].children[0].innerHTML);
          for (var i = 0; i < allNotesArr.length; i++) {
            if (allNotesArr[i].categoryActive === true) {

              let activeNotes = allNotesArr[i];
              let notesArray = allNotesArr[i].notes;

              for (var j = 0; j < notesArray.length; j++) {
                if (this.parentNode.children[1].children[1].children[0].innerHTML === notesArray[j].noteDate) {
                  let filteredArray = notesArray.filter((item) => item !== notesArray[j]);
                  notesArray = filteredArray;
                  allNotesArr[i].notes = notesArray;
                  buildNote();
                }
              }
            }
          }
        }

        noteContainerSmall.appendChild(checkbox);
        noteContainerSmall.appendChild(titleDateContainer);
        noteContainerSmall.appendChild(deleteButton);
        noteContainerSmall.appendChild(colorButton);
        noteContainerMain.appendChild(noteContainerSmall);
        noteContainerSmall.appendChild(colorButtonContainer);
      }
    }
  }
}

///////////////////// visibility func ///////////////////////

document.getElementById("menu__returnButton").addEventListener("click", function(event) {
  for (var i = 0; i < allNotesArr.length; i++) {
    allNotesArr[i].categoryActive = false;
  }
  visibilityFunc();
  buildCategory();
  buildNote();
  infoFunc();
})

// sredi kod nije najbolji // mozda moze switch
function visibilityFunc() {
  // visibility toggle
  let categoryForm = document.getElementById("category");
  let noteForm = document.getElementById("note");
  let categoryDisplay = document.getElementById("categoryList");
  let noteDisplay = document.getElementById("noteList");

  let noteToggle = false;

  for (var i = 0; i < allNotesArr.length; i++) {
    if (allNotesArr[i].categoryActive === true) {
      noteToggle = true;
    }
  }
  if (noteToggle === true) {
    // category hidden notes visible
    categoryForm.style.display = "none";
    categoryDisplay.style.display = "none";
    noteForm.style.display = "block";
    noteDisplay.style.display = "block";
  } else {
    // category visible notes hidden
    categoryForm.style.display = "block";
    categoryDisplay.style.display = "block";
    noteForm.style.display = "none";
    noteDisplay.style.display = "none";
  }
}

///////////////////// info func ///////////////////////

function infoFunc() {
  let infoText = document.getElementById("info__text");
  let categoryNumber = 0;
  let categoryCheckedNumber = 0;
  let categoryLastTimeMade = 0;
  let categoryLastDateMade = 0;
  let notesNumber = 0;

  for (var i = 0; i < allNotesArr.length; i++) {
    // getting number of categories
    categoryNumber++;
    if (allNotesArr[i].categoryCheck === true) {
      categoryCheckedNumber++;
    }

    // getting last date of categories
    let lastTime = allNotesArr[i].categoryTime.split(':').join('');
    let lastDate = allNotesArr[i].categoryDate.split('/').join('');
    if (lastDate + lastTime > categoryLastDateMade) {
      categoryLastTimeMade = lastTime;
      categoryLastDateMade = lastDate;
    }
    // date and time formattingd
    let timeOutput =
      categoryLastTimeMade.substring(0, 2) + ":" + categoryLastTimeMade.substring(2,4) + ":"
      + categoryLastTimeMade.substring(4,8);

    let dateOutput =
      categoryLastDateMade.substring(0, 2) + "/" + categoryLastDateMade.substring(2,4) + "/"
      + categoryLastDateMade.substring(4,8);

    if (allNotesArr[i].categoryActive === true) {
      // html info about notes
      for (var i = 0; i < allNotesArr.length; i++) {
        if (allNotesArr[i].categoryActive === true) {
          for (var j = 0; j < allNotesArr[i].notes.length; j++) {
            notesNumber++;
          }
        }
      }
      infoText.innerHTML = `number of notes  ${notesNumber}`;
    }
    else if (allNotesArr[i].categoryActive !== true) {
      // html info about categories
      infoText.innerHTML =
      `<span class="infoTextColorSPan">${categoryNumber}</span>
      categories, with
      <span class="infoTextColorSPan">${categoryCheckedNumber}</span>
      checked, last one at
      <span class="infoTextColorSPan">${timeOutput}</span>
      on
      <span class="infoTextColorSPan">${dateOutput}</span>`;
    }
  }
}

///////////////////// dark/light theme toggle ///////////////////////

document.getElementById("menu__themeButton").addEventListener("click", function(event) {

  darkTheme = !darkTheme;
  if (darkTheme) {
    document.documentElement.style.setProperty('--color1', '#515151');
    document.documentElement.style.setProperty('--color2', '#000000');
    document.documentElement.style.setProperty('--color3', '#d9d9d9');
    document.documentElement.style.setProperty('--color4', '#f4f4f4');
    document.documentElement.style.setProperty('--color5', '#ffffff');
    document.documentElement.style.setProperty('--color6', '#ed6088');
    // invert svg icons so that they are visible
    document.getElementById("themeButtonSvg").style.filter = "invert(100%)";
    document.getElementById("backButtonSvg").style.filter = "invert(100%)";














    // promeni src i updejtuj funkciju kad se napravi nova kategorija ili nota


    let categoryDelete = document.getElementsByClassName("deleteButtonSvg");
    let noteDelete = document.getElementsByClassName("deleteButtonSvg");
    for (var i = 0; i < categoryDelete.length; i++) {
      categoryDelete[i].style.filter = "invert(100%)";
    }
























  }
  if (!darkTheme) {
    document.documentElement.style.setProperty('--color1', '#ffffff');
    document.documentElement.style.setProperty('--color2', '#f4f4f4');
    document.documentElement.style.setProperty('--color3', '#d9d9d9');
    document.documentElement.style.setProperty('--color4', '#515151');
    document.documentElement.style.setProperty('--color5', '#000000');
    document.documentElement.style.setProperty('--color6', '#d2315f');
    // reset the invert filter
    document.getElementById("themeButtonSvg").style.filter = "invert(0%)";
    document.getElementById("backButtonSvg").style.filter = "invert(0%)";
  }

})




























//
