console.log("Welcome to Tic Tac Toe");

// Audio elements
let music = new Audio("Assets/Music.mp3");
let audioTurn = new Audio("Assets/play.mp3");
let gameover = new Audio("Assets/GameOver.mp3");
let tieSound = new Audio("Assets/Tie.mp3");
let winSound = new Audio("Assets/Win.mp3");

let audioElements = [music, audioTurn, gameover, tieSound];
let muteButton = document.getElementById('muteButton');
let isMuted = false;

music.loop = true;

let muteIcon = document.getElementById('muteIcon');
let unmuteIcon = document.getElementById('unmuteIcon');

// Toggle Mute & unmute
const toggleMute = () => {
    isMuted = !isMuted;
    audioElements.forEach(audio => {
        audio.muted = isMuted;
    });

    muteIcon.style.display = isMuted ? 'none' : 'inline';
    unmuteIcon.style.display = isMuted ? 'inline' : 'none';
};

muteButton.addEventListener('click', toggleMute);

const startMusic = () => {
    music.play().catch(error => {
        console.log("Auto-play prevented. Music needs user interaction.");
    });
};

startMusic();

let turn = "X";
let isGameOver = false;
let playerXWins = 0;
let playerOWins = 0;
let tieCount = 0; // Add tie counter

const changeTurn = () => {
    return turn === "X" ? "O" : "X";
};

// Update the win count display
const updateWinCount = () => {
    document.querySelector('.playerXWins').innerText = "Player X Wins: " + playerXWins;
    document.querySelector('.playerOWins').innerText = "Player O Wins: " + playerOWins;
    document.querySelector('.tieCount').innerText = "Ties: " + tieCount; // Update tie count display
};

// Check for a win
const checkWin = () => {
    let boxtext = document.getElementsByClassName('boxtext');
    let wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    let isTie = true;

    wins.forEach(e => {
        if (
            boxtext[e[0]].innerText === boxtext[e[1]].innerText &&
            boxtext[e[2]].innerText === boxtext[e[1]].innerText &&
            boxtext[e[0]].innerText !== ''
        ) {
            document.querySelector('.info').innerText = "Player " + boxtext[e[0]].innerText + " Won";
            isGameOver = true;
            music.pause();
            winSound.play();
            document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "200px";
            isTie = false;

            // Add winning-box class to the winning boxes
            e.slice(0, 3).forEach(index => {
                boxtext[index].parentElement.classList.add('winning-box');
            });

            // Update win counter
            if (boxtext[e[0]].innerText === 'X') {
                playerXWins++;
            } else if (boxtext[e[0]].innerText === 'O') {
                playerOWins++;
            }
            updateWinCount();
            showPopup( "Player " + boxtext[e[0]].innerText + " Won");
        }
    });

    // Check for a tie
    if (isTie && Array.from(boxtext).every(box => box.innerText !== '')) {
        document.querySelector('.info').innerText = "It's a Tie";
        isGameOver = true;
        music.pause();
        tieSound.play();
        tieCount++;
        updateWinCount(); 
        showPopup("It's a Tie");
    }
};

updateWinCount();

const playTurnSound = () => {
    if (!audioTurn.paused) {
        audioTurn.currentTime = 0;
    }
    audioTurn.play().catch(error => {
        console.log("Playback error:", error);
    });
};

// Game Logic
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element => {
    let boxtext = element.querySelector('.boxtext');
    element.addEventListener('click', () => {
        if (boxtext.innerText === '' && !isGameOver) {  // Prevent clicks after game is over
            boxtext.innerText = turn;
            turn = changeTurn();
            playTurnSound();
            checkWin();
            if (!isGameOver) {
                document.getElementsByClassName("info")[0].innerText = "Turn for Player " + turn;
            }
        }
    });
});

const resetButton = document.getElementById('reset');

resetButton.addEventListener('click', () => {
    let boxtexts = document.querySelectorAll('.boxtext');
    boxtexts.forEach(element => {
        element.innerText = "";
    });
    turn = "X";
    isGameOver = false;
    document.getElementsByClassName("info")[0].innerText = "Turn for Player " + turn;
    document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "0";
    document.querySelector(".line").style.width = "0";
    music.play();
    document.querySelectorAll('.box').forEach(cell => cell.classList.remove('winning-box')); // Remove winning-box class on reset
});

// Popup
const showPopup = (message) => {
    const popup = document.querySelector('.popup');
    const popupContent = document.querySelector('.popup-content');
    popupContent.querySelector('p').innerText = message;
    popup.style.display = 'flex';
};

const closePopup = () => {
    const popup = document.querySelector('.popup');
    popup.style.display = 'none';
};

const closeButton = document.querySelector('.close');
closeButton.addEventListener('click', closePopup);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
        closePopup();
    }
});