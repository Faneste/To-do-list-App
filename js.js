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
let allNotesArr = []; let activeCategory; let categoryInput; let noteInput; let noteVisiblity = false;

///////////////////// getting input ///////////////////////

// category input
document.getElementById("category__submitbutton").addEventListener("click", function(event){
  event.preventDefault();
  categoryInput = document.getElementById("category__textarea").value;

  time = new Date();
  allNotesArr.push({
    categoryTitle:categoryInput,
    categoryDate: time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds(),
    categoryActive: false,
    categoryCheck: false,
    notes: []
  });
  buildCategory();
  buildNote();
  infoFunc();
});

// note input
document.getElementById("note__submitbutton").addEventListener("click", function(event){
  event.preventDefault();
  noteInput = document.getElementById("note__textarea").value;
  let noteTime = new Date();

  let noteInputObject = {
    noteText: noteInput,
    noteDate: noteTime.getHours() + ":" + noteTime.getMinutes() + ":" + noteTime.getSeconds(),
    noteCheck: false,
    noteColor: "default"
  }

  for (var i = 0; i < allNotesArr.length; i++) {
    if (allNotesArr[i].categoryActive === true) {
      allNotesArr[i].notes.push(noteInputObject);
    }
  }
  buildCategory();
  buildNote();
  infoFunc();
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

    let categoryContainerMain = document.getElementById("category__display");

    let categoryContainerSmall = document.createElement("div");
    categoryContainerSmall.classList.add("category__container");
    categoryContainerSmall.onclick = function() {
      for (var i = 0; i < allNotesArr.length; i++) {
        if (this.children[1].innerHTML === allNotesArr[i].categoryDate) {
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
    date.innerHTML = item.categoryDate;
    date.classList.add("category__date");

    let categoryInfo = document.createElement("h3");
    let noteNumber = 0; let noteCheck = 0;
    for (var k = 0; k < item.notes.length; k++) {
      noteNumber++;
      if (item.notes[i].noteCheck !== undefined && item.notes[i].noteCheck === true) {
          noteCheck++;
      }
    };
    categoryInfo.innerHTML = `${noteNumber} notes / ${noteCheck} checked`;
    categoryInfo.classList.add("category__info");

    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.checked = item.categoryCheck;
    checkbox.onclick = function() {
      for (var i = 0; i < allNotesArr.length; i++) {
        if (this.parentNode.children[1].innerHTML === allNotesArr[i].categoryDate) {
          allNotesArr[i].categoryCheck = !allNotesArr[i].categoryCheck;
        }
      }
    }

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "delete category";
    deleteButton.classList.add("category__delete");
    deleteButton.onclick = function () {
      for (var i = 0; i < allNotesArr.length; i++) {
        if (this.parentNode.children[1].innerHTML === allNotesArr[i].categoryDate) {
          let filteredArray = allNotesArr.filter((item) => item !== allNotesArr[i]);
          allNotesArr = filteredArray;
          buildCategory();
        }
      }
    };

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

        let noteContainerMain = document.getElementById("note__display");

        let noteContainerSmall = document.createElement("div");
        noteContainerSmall.classList.add("note__container");
        noteContainerSmall.onclick = function() {
        }

        let title = document.createElement("h2");
        title.innerHTML = notesArray[j].noteText;
        title.classList.add("note__title");

        let date = document.createElement("h3");
        date.innerHTML = notesArray[j].noteDate;
        date.classList.add("note__date");

        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = notesArray[j].noteCheck;
        checkbox.onclick = function() {
          for (var i = 0; i < allNotesArr.length; i++) {
            if (allNotesArr[i].categoryActive === true) {

              let activeNotes = allNotesArr[i];
              let notesArray = allNotesArr[i].notes;

              for (var j = 0; j < notesArray.length; j++) {
                if (this.parentNode.children[1].innerHTML === notesArray[j].noteDate) {
                  notesArray[j].noteCheck = !notesArray[j].noteCheck;
                }
              }
            }
          }
        }

        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "delete note";
        deleteButton.classList.add("note__delete");
        deleteButton.onclick = function () {
          for (var i = 0; i < allNotesArr.length; i++) {
            if (allNotesArr[i].categoryActive === true) {

              let activeNotes = allNotesArr[i];
              let notesArray = allNotesArr[i].notes;

              for (var j = 0; j < notesArray.length; j++) {
                if (this.parentNode.children[1].innerHTML === notesArray[j].noteDate) {
                  let filteredArray = notesArray.filter((item) => item !== notesArray[j]);
                  notesArray = filteredArray;
                  allNotesArr[i].notes = notesArray;
                  buildNote();
                }
              }
            }
          }
        }

        noteContainerSmall.appendChild(title);
        noteContainerSmall.appendChild(date);
        noteContainerSmall.appendChild(deleteButton);
        noteContainerSmall.appendChild(checkbox);
        noteContainerMain.appendChild(noteContainerSmall);
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
  let categoryVis = document.getElementById("category");
  let noteVis = document.getElementById("note");
  let noteToggle = false;

  for (var i = 0; i < allNotesArr.length; i++) {
    if (allNotesArr[i].categoryActive === true) {
      noteToggle = true;
    }
  }
  if (noteToggle === true) {
    // category hidden notes visible
    categoryVis.style.display = "none";
    noteVis.style.display = "block";
  } else {
    // category visible notes hidden
    categoryVis.style.display = "block";
    noteVis.style.display = "none";
  }
}

///////////////////// info func ///////////////////////

function infoFunc() {
  let infoText = document.getElementById("info__text");
  let categoryNumber = 0;
  let notesNumber = 0;

  for (var i = 0; i < allNotesArr.length; i++) {
    categoryNumber++;
    if (allNotesArr[i].categoryActive === true) {
      // info about notes
      for (var i = 0; i < allNotesArr.length; i++) {
        if (allNotesArr[i].categoryActive === true) {
          for (var j = 0; j < allNotesArr[i].notes.length; j++) {
            notesNumber++;
          }
        }
      }
      infoText.innerHTML = `number of notes is ${notesNumber}`;
    }
    else if (allNotesArr[i].categoryActive !== true) {
      // info about categories
      infoText.innerHTML = `number of categories is ${categoryNumber}`;
    }
  }
}

///////////////////// dark/light theme toggle ///////////////////////

document.getElementById("menu__themeButton").addEventListener("click", function(event) {
  console.log("dark light theme");
})
































//
