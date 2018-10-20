const questionDisplay = $(`#questionDisplay`);
const answerDisplay = $(`#answerDisplay`);
const messageDisplay = $(`#messageDisplay`);
const timerDisplay = $(`#timeDisplay`);
const landingView = $(`#landingView`);
const gameView = $(`#gameView`);
const startButton = $(`#startButton`);
let numberCorrect = 0;
let numberWrong = 0;
let guessedQuestions = [];
let timeoutId;
let intervalId;
let timerDuration;
let mode;
let category;

let triviaGame = {

    data: [],
    //timerDuration: 5,

    setTimerDuration: function (mode) {
        if (mode === "easy") {
            timerDuration = 15;
        } else if (mode === "medium") {
            timerDuration = 10;
        } else {
            timerDuration = 5;
        }
    },

    //Generates a random number with the length of the data array as a range
    makeRandom: function () {
        console.log(`length of data array: ${this.data.length}`)
        let randomIndex = Math.floor(Math.random() * this.data.length);
        console.log(`randomIndex: ${randomIndex}`);
        return randomIndex;
    },

    makeQuestion: function () {
        let random = this.makeRandom();
        let question, correctAnswer, wrongAnswers;
        // pulls an entry from the data array so it cannot be chosen again
        let chosenData = this.data.splice(random, 1);

        question = chosenData[0].question;
        console.log(`chosen question: ${question}`)
        correctAnswer = chosenData[0].correct_answer;
        wrongAnswers = chosenData[0].incorrect_answers;

        return { queston: question, answer: correctAnswer, wrong: wrongAnswers };
    },

    serveQuestion: function () {
        let currentQuestion = this.makeQuestion();
        questionDisplay.html(`<p>${currentQuestion.queston}</p>`);
        // make random number between 0 and 3, store in variable correctAnswerSlot
        let correctAnswerSlot = Math.floor(Math.random() * 4 + 1);

        $(`#slot1`).removeAttr(`correct`);
        $(`#slot2`).removeAttr(`correct`);
        $(`#slot3`).removeAttr(`correct`);
        $(`#slot4`).removeAttr(`correct`);

        // use correctAnswerSlow to place correct answer randomly
        $(`#slot${correctAnswerSlot}`).text(`${currentQuestion.answer}`);
        $(`#slot${correctAnswerSlot}`).attr(`correct`, true); // custom attribute used to scan for correct answer placement

        // for each wrong answer loop through question slots, test is text is blank place wrong answers only in blank slots
        for (let i = 0; i < currentQuestion.wrong.length; i++) { //outer loop for wrong answers
            for (let j = 1; j < 5; j++) { //inner loop for each answerSlot
                if ($(`#slot${j}`).text() === "") {
                    //slot is blank, add wrong answer
                    $(`#slot${j}`).text(`${currentQuestion.wrong[i]}`);
                    break;
                } else {
                    //slot is not blank, skip
                }
            }
        }
    },

    startRound: function () {
        console.log(`round starting`);
        triviaGame.setBackground();
        questionDisplay.show();
        answerDisplay.show();
        messageDisplay.hide();
        console.log(`passing mode:${mode} into setTimeDuration`)
        triviaGame.setTimerDuration(mode);
        timerDisplay.show().text(timerDuration);
        $(`.slot`).text(``); //remove text so serveQuestion can place answers
        triviaGame.serveQuestion(); //retreive question + answers
        triviaGame.startTimer(timerDuration);
        // $(`.slot`).click(function () {
        //     let responseValue = $(this).attr('correct');
        //     event.preventDefault();
        //     console.log(responseValue);
        //     // triviaGame.checkAnswer(event);
        //     triviaGame.checkAnswer(responseValue);
        // })

    },

    // checkAnswer: function (event) {
    checkAnswer: function (responseOverallValue) {
        console.log(`checking answer...`);
        window.clearInterval(intervalId); // stop question timer from clicking
        console.log("Event: " + event.target.hasAttribute('correct'));
        // if (event.target.hasAttribute(`correct`) === true) {
        if (responseOverallValue) {
            console.log(`number guessed right:${numberCorrect}`);
            if (triviaGame.data.length === 0) {
                //player wins game
                numberCorrect++;
                triviaGame.displayMessage("game-over")
            } else {
                //player wins round
                numberCorrect++;
                triviaGame.displayMessage("round-win");
                console.log('in checkanswer - correct with more questions');
                window.setTimeout(triviaGame.startRound, 3000);
            }
        } else {
            console.log(`wrong:`);
            numberWrong++
            triviaGame.displayMessage(false);
            console.log('in checkanswer - wrong');
            window.setTimeout(triviaGame.startRound, 3000);
        }
        console.log(`check answer finished`);
    },

    displayMessage: function (roundResult) {
        questionDisplay.hide();
        answerDisplay.hide();
        messageDisplay.show();
        if (roundResult === "round-win") {
            console.log(`round-win display message executed`);
            messageDisplay.html(`<h1>Correct!</h1>`);
        } else if (roundResult === "game-over") {
            console.log(`gameover display message executed`);
            messageDisplay.html(
                `
                <h1>Game Over</h1>
                <br>
                <p>Correct: ${numberCorrect}, Wrong: ${numberWrong}</p>
                <p>Thanks for playing!</p>
                <button class="btn btn-info">Reset</button>
                `);
            $(`.btn-info`).click(function () {
                numberCorrect = 0;
                numberWrong = 0;
                triviaGame.requestData();
                console.log('in display - game over');
                window.setTimeout(triviaGame.requestData, 1000); //find better solution to wait for ajax response than a manual timer
            });

        } else if (roundResult === "time-over") {
            console.log(`time-over display message executed`);
            //numberWrong++;
            messageDisplay.html(`<h1>Time over</h1>`);
            console.log('in display - time over');
            window.setTimeout(triviaGame.startRound, 1000);
        } else {
            console.log(`incorrect answer display message executed`);
            messageDisplay.html(`<h1>Wrong!</h1>`);
        }

    },

    startTimer: function (duration) {
        let timer = duration;
        window.clearInterval(intervalId);
        intervalId = window.setInterval(function () {
            console.log(`tick tick...time=${timer}`)
            timer--;
            timerDisplay.html(timer);

            if (timer === 0) {
                console.log(`timer is now 0, clearing intervalId`)
                numberWrong++;
                window.clearInterval(intervalId);
                if (triviaGame.data.length === 0) {
                    console.log(`time expired, running display message with game-over`)
                    return timeoutId = window.setTimeout(triviaGame.displayMessage, 1000, "game-over");
                } else {
                    console.log(`time expired, running display message with time-over`)
                    return timeoutId = window.setTimeout(triviaGame.displayMessage, 1000, "time-over");
                }

            }
            console.log(`outside the if block`);
        }, 1000)

    },

    requestData: function () {
        $.ajax({
            method: "GET",
            url: `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`,
        })
            .done(function (response) {
                console.log(response);
                triviaGame.data = response.results;
                triviaGame.startRound();
            });
    },

    setBackground: function () {
        switch (category) {
            case "21":
                $(`body`).css("background", "url(assets/images/sports.jpg) no-repeat center center fixed");
                break;
            case "17":
                $(`body`).css("background", "url(assets/images/science.jpg) no-repeat center center fixed");
                break;
            case "12":
                $(`body`).css("background","url(assets/images/music.jpg) no-repeat center center fixed");
                break;
                default:
                $(`body`).css("background","linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12) no-repeat center center fixed");
                break;
        }
    }

}


//initiate game by calling triviaGame object
$(`document`).ready(function () {
    gameView.hide();

    startButton.click(function () {
        mode = $(`#modeSelect`).find(`:selected`).val();
        category = $(`#categorySelect`).find(`:selected`).val();
        console.log(category);
        console.log(mode);
        landingView.hide();
        gameView.show();
        triviaGame.requestData();
    });

    $(`.slot`).click(function () {
        let responseValue = $(this).attr('correct');
        event.preventDefault();
        console.log(responseValue);
        // triviaGame.checkAnswer(event);
        triviaGame.checkAnswer(responseValue);
    })


})

