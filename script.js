const dict = [];
const sevenLetterWords = [];
const possibleWords = [];
const rankValues = [
  { title: "Beginner", value: 0 },
  { title: "Good Start", value: 0 },
  { title: "Moving Up", value: 0 },
  { title: "Good", value: 0 },
  { title: "Solid", value: 0 },
  { title: "Nice", value: 0 },
  { title: "Great", value: 0 },
  { title: "Amazing", value: 0 },
  { title: "Genius", value: 0 },
];
let reqLetter = "";
const found = document.getElementById("found");
const attempt = document.getElementById("atempt");
const display = document.getElementById("display");
const letters = document.getElementById("letters");
const newTry = document.getElementById("new-try");
const shuffle = document.getElementById("shuffle");
const congrats = document.getElementById("congrats");
const ranks = document.getElementById("ranks");
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
  console.log(sourceWord);
  for (let i = 0; i < sourceWord.length; i++) {
    if (!currentLetters.includes(sourceWord.charAt(i))) {
      currentLetters.push(sourceWord.charAt(i));
    }
  }
  let req = currentLetters[Math.floor(Math.random() * 6)];
  reqLetter = req.toUpperCase();
  createButtons(currentLetters, reqLetter);
}

function checkWords() {
  for (let word of dict) {
    if (compare(word, currentLetters)) {
      maxScore += calculateScore(word);
      possibleWords.push(word.toUpperCase());
    } else {
      continue;
    }
  }
  renderRanks(maxScore);
}

function renderRanks(pts) {
  let header = document.createElement("tr");
  header.innerHTML = "<th>Rank</th><th>Points</th>";
  ranks.append(header);
  let baseline = pts * 0.025
  for (let i=8; i >= 0; i--) {
    rankValues[i].value = baseline * i;
    let newrow = document.createElement("tr");
    let newrank = document.createElement("td");
    let newpts = document.createElement("td");
    newrank.innerText = rankValues[i].title;
    newpts.innerText = Math.round(rankValues[i].value);
    newrow.append(newrank, newpts);
    ranks.append(newrow);
  }
}

function compare(str, arr) {
  for (let i = 0; i < str.length; i++) {
    if (!arr.includes(str.charAt(i))) {
      return false;
    }
  }
  if (!str.includes(reqLetter.toLowerCase())) {
    return false;
  }
  return true;
}

function inputLetter(e) {
  let entry = e.target.innerHTML;
  display.value += entry;
}

function inputWord() {
  let newWord = display.value;
  display.value = "";
  if (!newWord.includes(reqLetter)) {
    alert("Missing required letter");
  } else if (newWord.length < 4) {
    alert("Too short");
  } else if (wordsFound.includes(newWord)) {
    alert("already found");
  } else if (possibleWords.includes(newWord)) {
    points += calculateScore(newWord.toLowerCase());
    checkPangram(newWord.toLowerCase())
      ? (congrats.innerText = "***Pangram!***")
      : (congrats.innerText = congratMsg(newWord.length));
    setTimeout(() => {
      congrats.innerText = "";
    }, 1500);
    updateList(newWord);
    updateScore(points);
  } else {
    alert("Sorry, " + newWord + " is not in our dictionary.");
  }
}

function congratMsg(score) {
  switch (score) {
    case 4:
      return "Well done!";
    case 5:
      return "Great!";
    case 6:
      return "Awesome!";
    case 7:
      return "Brilliant!!";
    default:
      return "Amazing!!!";
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
    newitem.innerText = wordsFound[i];
    if (checkPangram(wordsFound[i].toLowerCase())) {
      newitem.setAttribute("class", "pangram");
    }
    list.append(newitem);
  }
  found.append(list);
}

function updateScore(pts) {
  // TODO
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
  } else if (currentLetters.includes(e.key)) {
    display.value += e.key.toUpperCase();
    e.key.blur();
  } else if (e.key === "Enter") {
    newTry.blur();
    inputWord();
  }
});

shuffle.addEventListener("click", () => {
  createButtons(currentLetters, reqLetter);
  shuffle.blur();
});

function createButtons(arr, req) {
  for (let i = currentLetters.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let k = currentLetters[i];
    currentLetters[i] = currentLetters[j];
    currentLetters[j] = k;
  }
  letters.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    let newbtn = document.createElement("button");
    newbtn.innerHTML = arr[i].toUpperCase();
    if (newbtn.innerHTML === req) {
      newbtn.setAttribute("id", "required");
    }
    newbtn.addEventListener("click", inputLetter);
    letters.append(newbtn);
  }
}

importDictionary();
