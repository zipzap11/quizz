import api from './api.js'

const quizCont = document.querySelector('.container');
const startBtn = document.querySelector('.start-btn');
const questionEl = document.querySelector('.question');
const answerEl = document.querySelectorAll('.answer p');
const answerBtn = document.querySelectorAll('.answer');
const nextBtn = document.querySelector('.next-btn');
const finishBtn = document.querySelector('.finish-btn')
const diffEl = document.querySelector('.difficulty');
const numEl = document.querySelector('.num');
const footerNum = document.querySelector('.footer-num');
const timeEl = document.querySelector('.time')
const timeLine = document.querySelector('.time-line')
const timeCont = document.querySelector('.time-cont')

let correctAnswer = '';
let index = 0;
let no = 0;
let data = await getData();
let score = 0;
let counter, counterLine;
let time = 10;
let lineWidth = 0;

startBtn.addEventListener('click', () => {
    inputData()
    quizCont.style.zIndex = 10;
    quizCont.style.opacity = '1';
    startTimer(time);
    startTimerLine(lineWidth);
});

nextBtn.addEventListener('click', () => {
    index++;
    lineWidth = 0;
    restartBtnState();
    inputData();
    clearInterval(counterLine);
    startTimerLine(lineWidth);
    clearTimer();
    startTimer(time);
})

answerBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        checkAnswer(e, correctAnswer);
        clearInterval(counterLine);
        clearTimer();
        disableBtn();
    })
})

finishBtn.addEventListener('click', () => {
    console.log(score);
    restartBtnState();
    restart();
})

function startTimer(time) {
    counter = setInterval(timer, 1000);

    function timer() {
        time--;
        timeEl.textContent = time;
        if (time <= 0) {
            clearInterval(counter);
            revealTrue(correctAnswer);
            disableBtn();
        }
    }
}

function startTimerLine(lineWidth) {
    let leng = timeCont.offsetWidth;
    let time = ((1 / (leng / 10)) * 1000);
    counterLine = setInterval(action, time)

    function action() {
        lineWidth += 1;
        timeLine.style.width = `${lineWidth}px`;
        if (lineWidth >= leng) {
            console.log('clear');
            clearInterval(counterLine);
        }
    }
}

function clearTimer() {
    clearInterval(counter);
    timeEl.innerText = 10;
}


function disableBtn() {
    answerBtn.forEach((e) => {
        e.style.pointerEvents = 'none';
    })
}

function restartBtnState() {
    answerBtn.forEach((e) => {
        e.style.pointerEvents = 'all';
    })
    answerEl.forEach((e) => {
        e.classList.remove('true')
        e.classList.remove('false')
    })
}

function createEl(el, content) {
    let element = document.createElement(el)
    element.innerHTML = content
    return element;
}

function checkAnswer(e, correct) {
    let answer = e.target
    let correctP = createEl('p', correct)
    console.log(answer)
    if (answer.classList.contains('ans')) {
        if (answer.innerHTML == correctP.innerHTML) {
            score++;
            answer.classList.add('true')
        } else {
            answer.classList.add('false')
            revealTrue(correct);
        }
    } else if (answer.classList.contains('cho')) {
        if (answer.nextElementSibling.innerHTML == correctP.innerHTML) {
            score++;
            answer.nextElementSibling.classList.add('true')
        } else {
            answer.nextElementSibling.classList.add('false')
            revealTrue(correct);
        }
    }
}

function revealTrue(correct) {
    answerEl.forEach((e) => {
        let correctP = createEl('p', correct)
        if (e.innerHTML == correctP.innerHTML) e.classList.add('true')
    })
}

function displayQuestion(el, data) {
    el.innerHTML = data
}

function displayChoice(el, data) {
    for (let i = 0; i < el.length; i++) {
        el[i].innerHTML = data[i]
    }
}

function inputData() {
    if (index > data.length - 2) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'block';
    }
    let question = data[index].question
    let choiceArr = shuffle([...data[index].incorrect_answers, data[index].correct_answer])
    let difficulty = data[index].difficulty
    correctAnswer = data[index].correct_answer
    no++;
    displayQuestion(numEl, no)
    displayQuestion(footerNum, no)
    displayQuestion(diffEl, difficulty)
    displayQuestion(questionEl, question)
    displayChoice(answerEl, choiceArr)
}

function restart() {
    quizCont.style.zIndex = 0;
    quizCont.style.opacity = '0';
    finishBtn.style.display = 'none'
    nextBtn.style.display = 'block'
    index = 0;
    no = 0;
    score = 0;
}

function shuffle(arr) {
    let i = arr.length - 1,
        index, temp;
    while (i >= 0) {
        index = Math.floor(Math.random() * i)
        temp = arr[i];
        arr[i] = arr[index];
        arr[index] = temp;
        i--;
    }
    return arr
}
async function getData() {
    console.log('fetch')
    let data = await api("https://opentdb.com/api.php?amount=10&category=31&type=multiple")
    console.log(data.results)
    return data.results;
}