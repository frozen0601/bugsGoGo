let socket = io();
var playerrole;
var starttime;
var loop;
var score;
const startingSection = document.querySelector('.starting-section');
const homeBtn = document.querySelector('.home-btn');
let crazyButton1 = document.getElementById('crazyButton1'); let crazyButton2 = document.getElementById('crazyButton2'); let crazyButton3 = document.getElementById('crazyButton3');
let crazyButton4 = document.getElementById('crazyButton4'); let crazyButton5 = document.getElementById('crazyButton5'); let crazyButton6 = document.getElementById('crazyButton6');
let crazyButton7 = document.getElementById('crazyButton7'); let crazyButton8 = document.getElementById('crazyButton8'); let crazyButton9 = document.getElementById('crazyButton9');
let crazyBtnList = [crazyButton1, crazyButton2, crazyButton3, crazyButton4, crazyButton5, crazyButton6, crazyButton7, crazyButton8, crazyButton9]
let vl_left = getOffset(document.getElementById('vl')).left;

startButton.addEventListener('click', () => {
    starttime = Date.now();
    socket.emit('startGame', starttime);
});

socket.on('startGame', (data) => {
    hideStartButton();
    normalInit();
    //crazyInit();
    starttime = data;
    loop = setInterval(function () {
        updateScore();
        updatePos();
        if (Date.now() - starttime >= 10000) gameover();
        else document.getElementById('timer').innerHTML = parseInt(10 - (Date.now() - starttime) / 1000);
    }, 10);

});

function hideStartButton() {
    startButton.style.display = "none";
    crazyBtnList.forEach(function (element) {
        element.style.display = "block";
    });
}

//choose team
ButtonA.addEventListener('click', () => {
    playerrole = "A";
    hideButton();
    crazyBtnList.forEach(function (element) {
        element.addEventListener('click', function () {
            console.log("element: ", element.id);
            console.log("element: ", element.style.top);
            socket.emit('crazyIsClicked', {
                dataID: element.id,
                offsetLeft: (0.5 + Math.random() / 2) * ((window.innerWidth - element.clientWidth)),
                offsetTop: Math.random() * ((window.innerHeight - element.clientHeight) - 50)
            });
        });
    });
    //socket.emit('teamSelected');
});

ButtonB.addEventListener('click', () => {
    playerrole = "B";
    hideButton();
    crazyBtnList.forEach(function (element) {
        element.addEventListener('click', function () {
            console.log("element: ", element.id);
            console.log("element: ", element.style.top);
            socket.emit('crazyIsClicked', {
                dataID: element.id,
                offsetLeft: (Math.random() / 2) * ((window.innerWidth - element.clientWidth)),
                offsetTop: Math.random() * ((window.innerHeight - element.clientHeight) - 50)
            });
        });
    });
    //socket.emit('teamSelected');
});

function hideButton() {
    ButtonA.style.display = "none";
    ButtonB.style.display = "none";
}

//socket.on('teamSelected', () => {



//console.log("console.log(playerrole);", playerrole);

//});



socket.on('crazyIsClicked', (data) => {
    console.log("data: ", data.dataID);
    goCrazy(data.dataID, data.offsetLeft, data.offsetTop);
});

function goCrazy(dataID, offLeft, offTop) {
    let top, left;

    left = offLeft;
    top = offTop;

    document.getElementById(dataID).style.top = top + 'px';
    document.getElementById(dataID).style.left = left + 'px';
    document.getElementById(dataID).style.animation = "none";
}

function normalInit() {
    normalButton(crazyButton1); normalButton(crazyButton2); normalButton(crazyButton3);
    normalButton(crazyButton4); normalButton(crazyButton5); normalButton(crazyButton6);
    normalButton(crazyButton7); normalButton(crazyButton8); normalButton(crazyButton9);
}

function crazyInit() {
    randomButton(crazyButton1); randomButton(crazyButton2); randomButton(crazyButton3);
    randomButton(crazyButton4); randomButton(crazyButton5); randomButton(crazyButton6);
    randomButton(crazyButton7); randomButton(crazyButton8); randomButton(crazyButton9);
}
function normalButton(buttonName) {
    if (buttonName.id == "crazyButton1") buttonName.style.top = (window.innerHeight / 2 - 420) + 'px';
    if (buttonName.id == "crazyButton2") buttonName.style.top = (window.innerHeight / 2 - 320) + 'px';
    if (buttonName.id == "crazyButton3") buttonName.style.top = (window.innerHeight / 2 - 220) + 'px';
    if (buttonName.id == "crazyButton4") buttonName.style.top = (window.innerHeight / 2 - 120) + 'px';
    if (buttonName.id == "crazyButton5") buttonName.style.top = (window.innerHeight / 2 -20) + 'px';
    if (buttonName.id == "crazyButton6") buttonName.style.top = (window.innerHeight / 2 + 80) + 'px';
    if (buttonName.id == "crazyButton7") buttonName.style.top = (window.innerHeight / 2 + 180) + 'px';
    if (buttonName.id == "crazyButton8") buttonName.style.top = (window.innerHeight / 2 + 280) + 'px';
    if (buttonName.id == "crazyButton9") buttonName.style.top = (window.innerHeight / 2 + 380) + 'px';
    buttonName.style.left = (window.innerWidth / 2 - 50) + 'px';
    buttonName.style.animation = "none";
}
function randomButton(buttonName) {
    buttonName.style.top = Math.random() * ((window.innerHeight - buttonName.clientHeight) - 50) + 'px';
    buttonName.style.left = Math.random() * ((window.innerWidth - buttonName.clientWidth) - 100) + 'px';
    buttonName.style.animation = "none";
}

socket.on('updateScore', (data) => {
    console.log("newscore: ", data);
    document.getElementById('score').innerHTML = data;
});

function updateScore() {
    let scoreA = 0;
    let scoreB = 0;
    crazyBtnList.forEach(function (element) {
        if (getOffset(element).left - vl_left > -50) scoreB++;
        else scoreA++;
    });
    score = scoreA.toString() + " - " + scoreB.toString();
    socket.emit('updateScore', score);
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

function updatePos() {
    crazyBtnList.forEach(function (element) {
        socket.emit('updatePos', {
            dataID: element.id,
            positionLeft: element.style.top,
            positionTop: element.style.left
        });
    });
}

function gameover() {
    clearInterval(loop);
    updateScoreboard(score);
    startButton.style.display = "initial";
    crazyBtnList.forEach(function (element) {
        element.style.display = "none";
    });
}

function updateScoreboard(score) {  //"3 - 6"
    var p = document.createElement("p");
    p.innerHTML = score[0] + " bugs " + score[4] + " bugs";
    scoreboard.appendChild(p);
    if (score[0] > score[4]) document.getElementById('startButton').innerHTML = "B has less bugs, B WIN! [RETRY]";
    else document.getElementById('startButton').innerHTML = "A has less bugs, A WIN! [RETRY]";
}