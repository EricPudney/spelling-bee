const dict = [];
const sevenLetterWords = [];
const possibleWords = [];
const score = document.getElementById("score");
const found = document.getElementById("found");
const attempt = document.getElementById("atempt");
const display = document.getElementById("display");
const letters = document.getElementById("letters");
const newTry = document.getElementById("new-try");
newTry.addEventListener("click", inputWord);
const currentLetters = [];
const wordsFound = [];
let points = 0;
let maxScore = 0;

function importDictionary() {
  fetch("./words_dictionary.json")
    .then(function (response) {
      return response.json();
    })
    .then((json) => {
      let wds = Object.keys(json);
      for (let wrd of wds) {
        if (wrd.length >= 4 && noOfLetters(wrd) < 8) {
          dict.push(wrd);
        }
        if (noOfLetters(wrd) === 7) {
          sevenLetterWords.push(wrd);
        }
      }
    })
    .then(pickLetters)
    .then(checkWords);
}

function pickLetters() {
  let randomiser = Math.random();
  let indexNo = Math.floor(sevenLetterWords.length * randomiser);
  let sourceWord = sevenLetterWords[indexNo];
  for (let i = 0; i < sourceWord.length; i++) {
    if (!currentLetters.includes(sourceWord.charAt(i))) {
      currentLetters.push(sourceWord.charAt(i));
    }
  }
  currentLetters.sort();
  for (let i = 0; i < currentLetters.length; i++) {
    let newbtn = document.createElement("button");
    newbtn.innerHTML = currentLetters[i].toUpperCase();
    newbtn.addEventListener("click", inputLetter);
    letters.append(newbtn);
  }

  let req = letters.firstElementChild;
  req.setAttribute("id", "required");
}

function checkWords() {
  for (let word of dict) {
    if (compare(word, currentLetters)) {
      maxScore += calculateScore(word);
      possibleWords.push(word);
    } else {
      continue;
    }
  }
}

function compare(str, arr) {
  for (let i = 0; i < str.length; i++) {
    if (!arr.includes(str.charAt(i))) {
      return false;
    }
  }
  if (!str.includes(arr[0])) {
    return false;
  }
  return true;
}

function inputLetter(e) {
  let entry = e.target.innerHTML;
  display.value += entry;
}

function inputWord() {
  let newWord = display.value.toLowerCase();
  display.value = "";
  if (!newWord.includes(currentLetters[0])) {
    alert("Missing required letter");
  } else if (newWord.length < 4) {
    alert("Too short");
  } else if (wordsFound.includes(newWord)) {
    alert("already found");
  } else if (possibleWords.includes(newWord)) {
    points += calculateScore(newWord);
    score.innerText = "Score: " + points;
    updateList(newWord);
  } else {
    alert("Sorry, " + newWord.toUpperCase() + " is not in our dictionary.");
  }
}

function calculateScore(word) {
  let pts = 0;
  word.length === 4 ? (pts += 1) : (pts += word.length);
  checkPangram(word) ? (pts += 7) : (pts = pts);
  return pts;
}

function updateList(word) {
  wordsFound.push(word);
  wordsFound.sort();
  found.innerHTML = "Words found:";
  let list = document.createElement("ul");
  for (let i = 0; i < wordsFound.length; i++) {
    let newitem = document.createElement("li");
    newitem.innerText = wordsFound[i].toUpperCase();
    list.append(newitem);
  }
  found.append(list);
}

function checkPangram(word) {
  if (
    word.includes(currentLetters[0]) &&
    word.includes(currentLetters[1]) &&
    word.includes(currentLetters[2]) &&
    word.includes(currentLetters[3]) &&
    word.includes(currentLetters[4]) &&
    word.includes(currentLetters[5]) &&
    word.includes(currentLetters[6])
  ) {
    return true;
  } else {
    return false;
  }
}

function noOfLetters(word) {
  let count = 1;
  for (i = 1; i < word.length; i++) {
    let slice = word.slice(0, i);
    let letter = word.charAt(i);
    if (slice.includes(letter)) {
      continue;
    } else {
      count++;
    }
  }
  return count;
}

window.addEventListener("keyup", (e) => {
  if (e.key === "Backspace" && display.value.length > 0) {
    let text = display.value;
    let newtext = text.slice(0, text.length - 1);
    display.value = newtext;
  }
  else if (currentLetters.includes(e.key)) {
    display.value += e.key.toUpperCase();
  }
  else if (e.key === "Enter") {
    inputWord();
  }
})

importDictionary();