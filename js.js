let noteToggle, activeCategory, categoryInput, noteInput; let allNotesArr = [];
let darkTheme = false; visibilityFunc(); placeHolder("categoryList", "category__container", "category");

///////////////////// getting input ///////////////////////

// category input
document.getElementById("category__submitbutton").addEventListener("click", function(event){
  event.preventDefault();
  categoryInput = document.getElementById("category__textarea").value;
  categoryInput = categoryInput.charAt(0).toUpperCase() + categoryInput.slice(1);

  if (categoryInput !== "") {
    allNotesArr.push({
      categoryTitle:categoryInput,
      categoryTime: timeFormat(),
      categoryDate: dateFormat(),
      categoryCheck: false,
      categoryActive: false,
      notes: [],
    });
    buildCategory();
    buildNote();
    infoFunc();
  } else {
    // flash input if empty
    flashInput("category__textarea");
  }
  document.getElementById("category__textarea").value = "";
});

// note input
document.getElementById("note__submitbutton").addEventListener("click", function(event){
  event.preventDefault();
  noteInput = document.getElementById("note__textarea").value;
  noteInput = noteInput.charAt(0).toUpperCase() + noteInput.slice(1);

  let noteInputObject = {
    noteText: noteInput,
    noteTime: timeFormat(),
    noteDate: dateFormat(),
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
    flashInput("note__textarea");
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

  // if category empty build "create new" placeholder
  if (allNotesArr.length === 0) { placeHolder("categoryList", "category__container", "category") };

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
    let noteNumber = 0; let noteChecked = 0;
    for (var k = 0; k < item.notes.length; k++) {
      noteNumber++;
      if (item.notes[k].noteCheck === true) {
        noteChecked++;
      }
    };
    categoryInfo.innerHTML =
    `<span class="category__info__span">
    ${noteNumber}</span> notes /
    <span class="category__info__span">${noteChecked}</span> checked`;
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
    deleteButton.innerHTML = '<img class="deleteButtonSvg" src="icons/deleteIcon.svg" alt="deleteSVG">';
    deleteButton.classList.add("category__delete", "svg");
    deleteButton.onclick = function () {
      this.parentNode.classList.add( "animated", "zoomOut");
      for (var i = 0; i < allNotesArr.length; i++) {
        if (this.parentNode.children[2].children[0].innerHTML === allNotesArr[i].categoryTime) {
          let filteredArray = allNotesArr.filter((item) => item !== allNotesArr[i]);
          allNotesArr = filteredArray;
          // delay rebuild for the animation to play out
          setTimeout(function() { buildCategory(); infoFunc(); }, 500);
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
  changeTheme();
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

      // if note empty build "create new" placeholder
      if (allNotesArr[i].notes.length === 0) { placeHolder("noteList", "note__container", "note"); };

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
        date.innerHTML = `made at
          <span class="note__date__span">${notesArray[j].noteTime}</span> on
          <span class="note__date__span">${notesArray[j].noteDate}</span>`;
        date.classList.add("note__date");

        let titleDateContainer = document.createElement("div");
        titleDateContainer.classList.add("note__titleDateContainer");
        titleDateContainer.appendChild(title);
        titleDateContainer.appendChild(date);
        titleDateContainer.onclick = function () {
          // toggle checkmark also when clicked on entire note
          for (var i = 0; i < allNotesArr.length; i++) {
            if (allNotesArr[i].categoryActive === true) {
              let notesArray = allNotesArr[i].notes;
              for (var j = 0; j < notesArray.length; j++) {
                if (this.parentNode.children[1].children[1].children[0].innerHTML === notesArray[j].noteTime) {
                  notesArray[j].noteCheck = !notesArray[j].noteCheck;
                }
              }
            }
          }
          buildNote();
          infoFunc();
        }

        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.classList.add("note__checkbox");
        checkbox.checked = notesArray[j].noteCheck;
        checkbox.onclick = function() {
          for (var i = 0; i < allNotesArr.length; i++) {
            if (allNotesArr[i].categoryActive === true) {
              let notesArray = allNotesArr[i].notes;
              for (var j = 0; j < notesArray.length; j++) {
                if (this.parentNode.children[1].children[1].children[0].innerHTML === notesArray[j].noteTime) {
                  notesArray[j].noteCheck = !notesArray[j].noteCheck;
                }
              }
            }
          }
          buildNote();
          infoFunc();
        }

        let colorButton = document.createElement("button");
        colorButton.innerHTML = '<img class="colorButtonSvg" src="icons/colorIcon.svg" alt="colorSVG">';
        colorButton.classList.add("note__color", "svg");
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
              if (this.parentNode.parentNode.children[1].children[1].children[0].innerHTML === notesArray[l].noteTime) {
                notesArray[l].noteActiveColor = this.style.backgroundColor;
              }
            }
            buildNote();
          }
        }

        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<img class="deleteButtonSvg" src="icons/deleteIcon.svg" alt="deleteSVG">';
        deleteButton.classList.add("note__delete", "svg");
        deleteButton.onclick = function () {
          this.parentNode.classList.add( "animated", "zoomOut");
          for (var i = 0; i < allNotesArr.length; i++) {
            if (allNotesArr[i].categoryActive === true) {
              let notesArray = allNotesArr[i].notes;
              for (var j = 0; j < notesArray.length; j++) {
                if (this.parentNode.children[1].children[1].children[0].innerHTML === notesArray[j].noteTime) {
                  let filteredArray = notesArray.filter((item) => item !== notesArray[j]);
                  notesArray = filteredArray;
                  allNotesArr[i].notes = notesArray;
                  // delay rebuild for the animation to play out
                  setTimeout(function() { buildNote(); infoFunc(); }, 500);
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
  changeTheme();
}

//////////// create placeholder if category/notes are empty ////////////

function placeHolder(container, tempContainer, typeAttr) {
  let containerMain = document.getElementById(container);

  let placeHolderContainer = document.createElement("div");
  placeHolderContainer.classList.add(tempContainer);
  let placeHolderText = document.createElement("h3");
  placeHolderText.id = "placeholder__text";
  placeHolderText.innerHTML = `Create new ${typeAttr}`;

  placeHolderContainer.appendChild(placeHolderText);
  containerMain.appendChild(placeHolderContainer);
}

///////////////////// flash input if empty ///////////////////////

// flash input if empty
function flashInput(elementId) {
  var t = setInterval(function () {
  var ele = document.getElementById(elementId);
    ele.style.visibility  = (ele.style.visibility  == "hidden" ? "" : "hidden");
  }, 100);
  setTimeout(function( ) { clearInterval( t ); }, 600);
}

///////////////////// time formatting ///////////////////////

// time formatting, add zero if time is 10:2:22 for example
function timeFormat() {
  time = new Date();
  let hours = (time.getHours()<10?'0':'') + time.getHours();
  let minutes = (time.getMinutes()<10?'0':'') + time.getMinutes();
  let seconds = (time.getSeconds()<10?'0':'') + time.getSeconds();
  return hours + ":" + minutes + ":" + seconds;
}

// date formatting
function dateFormat() {
  time = new Date();
  let dd = String(time.getDate()).padStart(2, '0');
  let mm = String(time.getMonth() + 1).padStart(2, '0');
  let yyyy = time.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
}

///////////////////// delete checked notes/categories ///////////////////////

document.getElementById("menu__checkedButton").addEventListener("click", function(event) {
  // if categories visible then delete Categories
  let confirm2 = confirm("Delete all checked messages?");
  if (confirm2 == true) {
    if (!noteToggle) {
      let uncheckedArray = [];
      for (var i = 0; i < allNotesArr.length; i++) {
        if (allNotesArr[i].categoryCheck !== true) {
          uncheckedArray.push(allNotesArr[i]);
        }
      }
      allNotesArr = uncheckedArray;
    }
    // if notes visible then delete notes
    if (noteToggle) {
      for (var b = 0; b < allNotesArr.length; b++) {
        if (allNotesArr[b].categoryActive) {
          let notesArray = allNotesArr[b].notes;
          notesArray.forEach(function(item) {
            if (item.noteCheck) {
              let filteredArray = notesArray.filter((item2) => item2 !== item);
              notesArray = filteredArray;
              allNotesArr[b].notes = notesArray;
            }
          })
        }
      }
    }
    buildCategory();
    buildNote();
    infoFunc();
  }
})

///////////////////// visibility func ///////////////////////

document.getElementById("menu__returnButton").addEventListener("click", function(event) {
  for (var i = 0; i < allNotesArr.length; i++) {
    allNotesArr[i].categoryActive = false;
  }
  // delay display for the animation to play out
  setTimeout(function() {
    buildCategory();
    buildNote();
    infoFunc();
  }, 500);
  visibilityFunc();
})

function visibilityFunc() {
  // visibility toggle
  let categoryForm = document.getElementById("category");
  let noteForm = document.getElementById("note");
  let categoryDisplay = document.getElementById("categoryList");
  let noteDisplay = document.getElementById("noteList");

  noteToggle = false;

  for (var i = 0; i < allNotesArr.length; i++) {
    if (allNotesArr[i].categoryActive) {
      noteToggle = true;
    }
  }
  if (noteToggle) {
    // category hidden / notes visible
    categoryDisplay.classList.remove( "animated", "bounceInLeft");
    categoryDisplay.classList.add( "animated", "bounceOutLeft");
    noteDisplay.classList.remove( "animated", "bounceOutRight");
    noteDisplay.classList.add( "animated", "bounceInRight");
    // delay display for the animation to play out
    setTimeout(function() {
      categoryForm.style.display = "none";
      categoryDisplay.style.display = "none";
      noteForm.style.display = "block";
      noteDisplay.style.display = "block";
    }, 300);
    // back button visible
    document.getElementById("menu__returnButton").style.opacity = "100%";
  } else {
    // category visible / notes hidden
    categoryDisplay.classList.remove( "animated", "bounceOutLeft");
    categoryDisplay.classList.add( "animated", "bounceInLeft");
    noteDisplay.classList.remove( "animated", "bounceInRight");
    noteDisplay.classList.add( "animated", "bounceOutRight");
    // delay display for the animation to play out
    setTimeout(function() {
      categoryForm.style.display = "block";
      categoryDisplay.style.display = "block";
      noteForm.style.display = "none";
      noteDisplay.style.display = "none";
    }, 300);
    // back button not visible
    document.getElementById("menu__returnButton").style.opacity = "10%";
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
  let notesCheckedNumber = 0;
  let noteLastTimeMade = 0;
  let noteLastDateMade = 0;

  ///// category info //////
  for (var i = 0; i < allNotesArr.length; i++) {
    // getting number of categories
    categoryNumber++;
    if (allNotesArr[i].categoryCheck) {
      categoryCheckedNumber++;
    }

    // getting last date of categories
    let lastTime = allNotesArr[i].categoryTime.split(':').join('');
    let lastDate = allNotesArr[i].categoryDate.split('/').join('');
    if (lastDate + lastTime > categoryLastDateMade) {
      categoryLastTimeMade = lastTime;
      categoryLastDateMade = lastDate;
    }
    // date and time formatting
    let timeOutput =
      categoryLastTimeMade.substring(0, 2) + ":" + categoryLastTimeMade.substring(2,4) + ":"
      + categoryLastTimeMade.substring(4,8);

    let dateOutput =
      categoryLastDateMade.substring(0, 2) + "/" + categoryLastDateMade.substring(2,4) + "/"
      + categoryLastDateMade.substring(4,8);

    if (!allNotesArr[i].categoryActive) {
      // html info
      infoText.innerHTML =
      `<span class="infoTextColorSPan">${categoryNumber}</span>
      categories,
      <span class="infoTextColorSPan">${categoryCheckedNumber}</span>
      checked, last one
      <span class="infoTextColorSPan">${timeOutput}</span>
      on
      <span class="infoTextColorSPan">${dateOutput}</span>`;
    }
  }

  ///// notes info //////
  if (noteToggle) {
    let timeOutput = "?";
    let dateOutput = "?";
    for (var i = 0; i < allNotesArr.length; i++) {
      if (allNotesArr[i].categoryActive) {
        if (allNotesArr[i].notes.length > 0) {
          for (var k = 0; k < allNotesArr[i].notes.length; k++) {
            // getting last date of notes
            let lastTime = allNotesArr[i].notes[k].noteTime.split(':').join('');
            let lastDate = allNotesArr[i].notes[k].noteDate.split('/').join('');
            if (lastDate + lastTime > noteLastDateMade) {
              noteLastTimeMade = lastTime;
              noteLastDateMade = lastDate;
            }
            // date and time formatting
            timeOutput =
              noteLastTimeMade.substring(0, 2) + ":" + noteLastTimeMade.substring(2,4) + ":"
              + noteLastTimeMade.substring(4,8);

            dateOutput =
              noteLastDateMade.substring(0, 2) + "/" + noteLastDateMade.substring(2,4) + "/"
              + noteLastDateMade.substring(4,8);
          }
        }
        for (var i = 0; i < allNotesArr.length; i++) {
          if (allNotesArr[i].categoryActive === true) {
            for (var j = 0; j < allNotesArr[i].notes.length; j++) {
              notesNumber++;
            }
            for (var b = 0; b < allNotesArr[i].notes.length; b++) {
              if (allNotesArr[i].notes[b].noteCheck === true) {
                notesCheckedNumber++;
              }
            }
          }
        }
      }

      // html info
      infoText.innerHTML =
      `<span class="infoTextColorSPan">${notesNumber}</span> notes, with
      <span class="infoTextColorSPan">${notesCheckedNumber}</span> checked, last one at
      <span class="infoTextColorSPan">${timeOutput}</span> on
      <span class="infoTextColorSPan">${dateOutput}</span>`;
    }
  }
}

///////////////////// dark/light theme toggle ///////////////////////

document.getElementById("menu__themeButton").addEventListener("click", toggleTheme);

function toggleTheme() {
  darkTheme = !darkTheme;
  changeTheme();
}

function changeTheme() {
  let allSvg = document.getElementsByClassName("svg");
  if (darkTheme) {
    // lighten the bg color a little bit intead of the black root var
    document.getElementsByTagName("BODY")[0].style.backgroundColor = "#1b1a1a";
    // set the vars
    document.documentElement.style.setProperty('--color1', '#515151');
    document.documentElement.style.setProperty('--color2', '#000000');
    document.documentElement.style.setProperty('--color3', '#d9d9d9');
    document.documentElement.style.setProperty('--color4', '#f4f4f4');
    document.documentElement.style.setProperty('--color5', '#ffffff');
    document.documentElement.style.setProperty('--color6', '#ed6088');
    // invert svg icons so that they are visible
    for (var i = 0; i < allSvg.length; i++) { allSvg[i].style.filter = "brightness(1000%)"; }
  }
  if (!darkTheme) {
    // lighten the bg color a little bit intead of the black root var
    document.getElementsByTagName("BODY")[0].style.backgroundColor = "var(--color2)";
    // set the vars
    document.documentElement.style.setProperty('--color1', '#ffffff');
    document.documentElement.style.setProperty('--color2', '#f4f4f4');
    document.documentElement.style.setProperty('--color3', '#d9d9d9');
    document.documentElement.style.setProperty('--color4', '#515151');
    document.documentElement.style.setProperty('--color5', '#000000');
    document.documentElement.style.setProperty('--color6', '#d2315f');
    // reset the invert filter
    // invert svg icons so that they are visible
    for (var i = 0; i < allSvg.length; i++) { allSvg[i].style.filter = "brightness(100%)"; }
  }
}

///////////////////// intro logo animation ///////////////////////

let introLogo = setInterval(function() {
  document.getElementById("logoContainer__svg").classList.add( "animated", "bounceOutUp");
}, 1000);

let introBackground = setInterval(function() {
  document.getElementById("logoContainer").style.display = "none";
}, 1700);

///////////////////// local storage ///////////////////////

window.onunload = function() {
  localStorage.removeItem('noteStorage');
  localStorage.setItem("noteStorage", JSON.stringify(allNotesArr));

  localStorage.removeItem('theme');
  localStorage.setItem("theme", darkTheme);
};

window.onload = function () {
  if (localStorage.getItem('noteStorage') !== null) {
    let storage = localStorage.getItem('noteStorage');
    allNotesArr = JSON.parse(storage);

    darkTheme = JSON.parse(localStorage.getItem('theme'));

    buildCategory();
    buildNote();
    infoFunc();
  }
}








//
