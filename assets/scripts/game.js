const questionDisplay = $(`#questionDisplay`);
const answerDisplay = $(`#answerDisplay`);
const messageDisplay = $(`#messageDisplay`);
let numberCorrect = 0;
let numberWrong = 0;
let guessedQuestions = [];

//taken from 
let triviaGame = {
    //full length array, 20 questions
    //data: [{ "category": "Science & Nature", "type": "multiple", "difficulty": "easy", "question": "How many objects are equivalent to one mole?", "correct_answer": "6.022 x 10^23", "incorrect_answers": ["6.002 x 10^22", "6.022 x 10^22", "6.002 x 10^23"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "hard", "question": "How many legs is it biologically impossible for a centipede to have?", "correct_answer": "100", "incorrect_answers": ["26", "50", "74"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "medium", "question": "Which chemical element has the lowest boiling point?", "correct_answer": "Helium", "incorrect_answers": ["Hydrogen", "Neon", "Nitrogen"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "easy", "question": "What is the powerhouse of the cell?", "correct_answer": "Mitochondria", "incorrect_answers": ["Ribosome", "Redbull", "Nucleus"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "hard", "question": "An organic compound is considered an alcohol if it has what functional group?", "correct_answer": "Hydroxyl", "incorrect_answers": ["Carbonyl", "Alkyl", "Aldehyde"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "easy", "question": "How many planets make up our Solar System?", "correct_answer": "8", "incorrect_answers": ["7", "9", "6"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "hard", "question": "All of the following human genetic haplogroup names are shared between Y-chromosome and mitochondrial DNA haplogroups EXCEPT:", "correct_answer": "Haplogroup U", "incorrect_answers": ["Haplogroup L", "Haplogroup T", "Haplogroup J"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "easy", "question": "What does DNA stand for?", "correct_answer": "Deoxyribonucleic Acid", "incorrect_answers": ["Deoxyribogenetic Acid", "Deoxyribogenetic Atoms", "Detoxic Acid"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "medium", "question": "Which of these is NOT a part of the structure of a typical neuron?", "correct_answer": "Islets of Langerhans", "incorrect_answers": ["Node of Ranvier", "Schwann cell", "Myelin sheath"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "medium", "question": "Which part of the body does glaucoma affect?", "correct_answer": "Eyes", "incorrect_answers": ["Throat", "Stomach", "Blood"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "hard", "question": "Which moon is the only satellite in our solar system to possess a dense atmosphere?", "correct_answer": "Titan", "incorrect_answers": ["Europa", "Miranda", "Callisto"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "medium", "question": "Myopia is the scientific term for which condition?", "correct_answer": "Shortsightedness", "incorrect_answers": ["Farsightedness", "Double Vision", "Clouded Vision"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "hard", "question": "What is the molecular formula of Ozone?", "correct_answer": "O3", "incorrect_answers": ["C6H2O6", "N2O", "SO4"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "medium", "question": "What stage of development do the majority of eukaryotic cells remain in for most of their life?", "correct_answer": "Interphase", "incorrect_answers": ["Prophase", "Stasis", "Telophase"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "easy", "question": "71% of the Earth's surface is made up of?", "correct_answer": "Water", "incorrect_answers": ["Deserts", "Continents", "Forests"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "hard", "question": "What genetic disease is caused by having an extra Y chromosome (XYY)?", "correct_answer": "Jacob's Syndrome", "incorrect_answers": ["Klinefelter's Syndrome", "Turner's Syndrome", "Down Syndrome"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "medium", "question": "What is radiation measured in?", "correct_answer": "Gray ", "incorrect_answers": ["Watt", "Decibel", "Kelvin"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "hard", "question": "What does the term \"isolation\" refer to in microbiology?", "correct_answer": "The separation of a strain from a natural, mixed population of living microbes", "incorrect_answers": ["A lack of nutrition in microenviroments", "The nitrogen level in soil", "Testing effects of certain microorganisms in an isolated enviroments, such as caves"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "hard", "question": "How much radiation does a banana emit?", "correct_answer": "0.1 Microsievert", "incorrect_answers": ["0.3 Microsievert", "0.5 Microsievert", "0.7 Microsievert"] }, { "category": "Science & Nature", "type": "multiple", "difficulty": "medium", "question": "Which planet did the \"Viking 1\" pacecraft send surface images of, starting in 1976?", "correct_answer": "Mars", "incorrect_answers": ["Saturn", "Jupiter", "Venus"] }],
    
    //test array with shorter length
    data: [{ "category": "Science & Nature", "type": "multiple", "difficulty": "easy", "question": "How many objects are equivalent to one mole?", "correct_answer": "6.022 x 10^23", "incorrect_answers": ["6.002 x 10^22", "6.022 x 10^22", "6.002 x 10^23"] },{ "category": "Science & Nature", "type": "multiple", "difficulty": "hard", "question": "How many legs is it biologically impossible for a centipede to have?", "correct_answer": "100", "incorrect_answers": ["26", "50", "74"] }],



    //Generates a random number with the length of the data array as a range
    makeRandom: function () {
        //console.log(randomNumbers);
        let randomIndex = Math.floor(Math.random() * this.data.length);
        return randomIndex;
    },

    makeQuestion: function () {
        let random = this.makeRandom();

        // pulls an entry from the data array so it cannot be chosen again
        let chosenData = this.data.splice(random,1);

        let question = chosenData[0].question;
        let correctAnswer = chosenData[0].correct_answer;
        let wrongAnswers = chosenData[0].incorrect_answers;

        return { queston: question, answer: correctAnswer, wrong: wrongAnswers };
    },

    serveQuestion: function () {
        let currentQuestion = this.makeQuestion();
        questionDisplay.html(`<p>${currentQuestion.queston}</p>`);
        // make random number between 0 and 3, store in variable correctAnswerSlot
        let correctAnswerSlot = Math.floor(Math.random() * 4 + 1);
        console.log(`placing correct answer in slot${correctAnswerSlot}`);

        // use correctAnswerSlow to place correct answer randomly
        console.log(`correct: ${currentQuestion.answer}`);
        console.log(`incorrect:${currentQuestion.wrong}`);
        $(`#slot${correctAnswerSlot}`).text(`${currentQuestion.answer}`);
        $(`#slot${correctAnswerSlot}`).attr(`correct`, true);

        // for each wrong answer loop through question slots, test is text is blank place wrong answers only in blank slots
        for (let i = 0; i < currentQuestion.wrong.length; i++) { //outer loop for wrong answers
            for (let j = 1; j < 5; j++) { //inner loop for each answerSlot
                if ($(`#slot${j}`).text() === "") {
                    //slot is blank, add wrong answer
                    console.log(`slot${j} is blank`);
                    console.log(`pushing ${currentQuestion.wrong[i]} into slot${j}`);
                    $(`#slot${j}`).text(`${currentQuestion.wrong[i]}`);
                    break;
                } else {
                    //slot is not blank, skip
                    console.log(`slot${j} is not blank`);
                }
            }
        }
    },

    startRound: function () {
        /*
        Notes for implementing timer-

        startRound initiates
        serveQuestion runs
        timer starts, value stored in variables
        while(timerVariable > 0){
            click event for choosing answer
        }
        time is out - display message
        */

        questionDisplay.show();
        answerDisplay.show();
        messageDisplay.hide();
        $(`.slot`).text(``); //remove text so serveQuestion can place answers
        triviaGame.serveQuestion(); //retreive question + answers
        $(`.slot`).click(function () {
            triviaGame.checkAnswer(event);
        })

    },

    checkAnswer: function (event) {
        console.log(`checking answer...`);
        if (event.target.hasAttribute(`correct`) === true) {
            console.log(`correct:${numberCorrect}`);
            // numberCorrect++;
            if(triviaGame.data.length === 0){
                numberCorrect++;
                //player wins game
                triviaGame.displayMessage("game-over")
            }else{
                //player wins round
                numberCorrect++;
                triviaGame.displayMessage("round-win");
                window.setTimeout(triviaGame.startRound, 2000);
            }
            // triviaGame.displayMessage(true);
        } else {
            console.log(`wrong:`);
            numberWrong++
            triviaGame.displayMessage(false);
            window.setTimeout(triviaGame.startRound, 2000);
        }

        //start a new round after short timer
        // window.setTimeout(triviaGame.startRound, 2000);
    },

    displayMessage: function (gameResult) {
        questionDisplay.hide();
        answerDisplay.hide();
        messageDisplay.show();
        if (gameResult === "round-win") {
            messageDisplay.html(`<h1>Correct!</h1>`);
        } else if(gameResult === "game-over"){ 
            messageDisplay.html(
                `
                <h1>Game Over</h1>
                <br>
                <p>Correct: ${numberCorrect}, Wrong: ${numberWrong}</p>
                <p>Thanks for playing!</p>
                <button class="btn btn-info">Reset</button>
                `)
        } else {
            messageDisplay.html(`<h1>Wrong!</h1>`);
        }

    }

}


//initiate game by calling triviaGame object
triviaGame.startRound();