// //////////////////////////////////////////////////////////////////////////////*
/* 
A normal array traversal takes O(n) time to search if a word is valid
whereas a Trie traversal takes O(1) time to search for a word
the fact that there are around 158390 5 letter words, trie is faster
This change in time complexity can be experienced when the letters are not 
restricted to 5. 
*/
/// Implementing the Trie data structure

function Node(value){
    this.value = value
    this.children = new Map()
}

class Trie {
    constructor() {
        this.root = new Node(null)
    }

    insert(word) {
        let current = this.root
        for (let character of word) {
            if (current.children[character] === undefined) {
                current.children[character] = new Node(character)
            }
            current = current.children[character]
        }
    }

    search(word) {
        let current = this.root
        for (let character of word) {
            if (current.children[character] === undefined) {
                return false
            }
            current = current.children[character]
        }
        return (current.children.size === 0)
    }
}

///////////////////////////////////////////////////////////////////////////////
import { WORDS } from "./words.js";
// Inserting the words into the Trie data structure for further reference
const trie = new Trie();
for (let word of WORDS) {
    trie.insert(word);
}

///////////////////////////////////////////////////////////////////////////////

// Initializing the variables to keep track of user input
const allowedGuesses = 6
let remainingGuesses = allowedGuesses
let currentGuess = []
let currentLetter = 0
let answer = WORDS[Math.floor(Math.random() * WORDS.length)]

// function to initialize a grid of white boxes once the page opens
function initializeGrid() {
    let board = document.getElementById("guess-grid");
    for (let i = 0; i < allowedGuesses; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }
        board.appendChild(row)
    }
}

// function to reset the grid boxes for a new attempt for a new word
function resertGrid() {
    remainingGuesses = allowedGuesses
    currentGuess = []
    currentLetter = 0
    answer = WORDS[Math.floor(Math.random() * WORDS.length)];
    let rows = document.getElementsByClassName("letter-row")
    for(let i = 0; i < allowedGuesses; i++){
        for(let j = 0; j < 5; j++){
            let box = rows[i].children[j]
            box.removeAttribute("style")
            box.textContent = ""
            box.classList.remove("filled-box")
        }
    }
}

// function to reset the keyboard back to unmarked form
function resetKeyBoard() {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        elem.style.backgroundColor = "white"
    }
}

//function to color code the keyboard based on the guesses made by the user
function colorCodeKeys(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            }
            if (oldColor === 'yellow' && color !== 'green') {
                return
            }
            elem.style.backgroundColor = color
            break
        }
    }
}

// function to insert a letter entry in the grid
function insertLetter(pressedKey) {
    if (currentLetter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[6 - remainingGuesses]
    let box = row.children[currentLetter]
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    currentLetter += 1
}

// function to delete a letter entry in the grid
function deleteLetter() {
    let row = document.getElementsByClassName("letter-row")[6 - remainingGuesses]
    let box = row.children[currentLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    currentLetter -= 1
}

// function to validate a guess made by the user and eventually
// register the guess in the grid and the keyboard
function validateGuess() {
    let row = document.getElementsByClassName("letter-row")[6 - remainingGuesses]
    let guessString = ''
    let rightGuess = Array.from(answer)
    for (const val of currentGuess) {
        guessString += val
    }
    if (guessString.length != 5) {
        alert("Not enough letters!")
        return
    }
    //traversing through trie to find out if the word exists in the list of words
    if (!trie.search(guessString)) {
        alert("Word not in list!")
        return
    }
    var select_audio = new Audio('./audio/flip.mp3')
    select_audio.load()
    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]

        let letterPosition = rightGuess.indexOf(currentGuess[i])
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            if (currentGuess[i] === rightGuess[i]) {
                letterColor = 'green'
            } else {
                letterColor = 'yellow'
            }

            rightGuess[letterPosition] = "#"
        }
        let delay = 250 * i
        setTimeout(() => {
            box.style.backgroundColor = letterColor
            colorCodeKeys(letter, letterColor)
            select_audio.currentTime = 0
            select_audio.play()
        }, delay)
    }
    setTimeout(() => {
        if (guessString === answer) {
            var nice = new Audio("./audio/noice.mp3")
            nice.load();
            nice.play();
            setTimeout(() => {
                alert("You guessed right! Game over!")
            }, 1000)
            remainingGuesses = 0
            return
        } else {
            remainingGuesses -= 1;
            currentGuess = [];
            currentLetter = 0;

            if (remainingGuesses === 0) {
                alert("You've run out of guesses! Game over!")
                alert(`The right word was: "${answer}"`)
            }
        }
    }, 1250)
}

var click_audio = new Audio("./audio/click.mp3");
click_audio.load();
document.addEventListener("keyup", (e) => {
    if (remainingGuesses === 0) {
        return
    }
    let pressedKey = String(e.key)
    console.log(pressedKey)
    if (pressedKey === "Backspace" && currentLetter !== 0) {
        click_audio.currentTime = 0
        click_audio.play()
        deleteLetter()
        return
    }
    if (pressedKey === "Enter") {
        validateGuess()
        return
    }
    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        click_audio.currentTime = 0
        click_audio.play()
        insertLetter(pressedKey)
    }
})

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    console.log(target.textContent)
    let key = target.textContent
    if (key === "Delete") {
        key = "Backspace"
    }
    document.dispatchEvent(new KeyboardEvent("keyup", { 'key': key }))
})

document.getElementById('new-game').onclick = () => {
    var select_audio = new Audio('./audio/select.mp3')
    select_audio.load()
    select_audio.play()
    resertGrid()
    resetKeyBoard()
}
document.getElementById('back-button').onclick = () => {
    var select_audio = new Audio('./audio/select.mp3')
    select_audio.load()
    select_audio.play()
    const rootPath = '/';
    const rootUrl = new URL(rootPath, window.location.origin);
    setTimeout(() => { window.location.href = rootUrl }, 500)
}

initializeGrid();

