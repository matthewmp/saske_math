class Player  {
    constructor(){
        this.level = 1;
    }

    init(){
        this.retrieveLevel();
    }
    
    incLevel(){
        if(this.level < 10) {
            this.level += 1;
        }
    }

    setLevel(newLevel) {
        this.level = newLevel;
    }

    save(){
        localStorage.setItem('mathGameLevel', this.level)
    }

    retrieveLevel(){
        let level = parseInt(localStorage.getItem('mathGameLevel'));
        if(!isNaN(level)){
            this.setLevel(level);
        }
    }
}

class Levels {
    constructor(player){
        player.init();
        this.currentLevel = player.level;
        this.element = document.querySelector('.levels-wrapper');
        this.init();
    }

    init(){
        this.render();
    }

    incLevel(){
        if(this.currentLevel < 10) {
            this.currentLevel += 1;
            player.setLevel(this.currentLevel);
            player.save();
            this.render();
        }
    }

    render(){
        const level = this.currentLevel;
        if(level > 1){
            this.element.querySelector(`.l${level-1}`).classList.remove('level-highlight');    
        }

        this.element.querySelector(`.l${level}`).classList.add('level-highlight');
    }
}

class Game{
    constructor(levels){
        this.levels = levels;
        this.elem = {};
        this.upperNum = null;
        this.base;
        this.correctAnswer = null;
        this.submitedAnswer = null;
        this.numbersArr = [];
        this.consecutiveWins = 0;
        this.incorrectAnswers = [];
        this.eventsBound = false;
    }

    init(){
        this.grabElements();
        this.incorrectAnswers.length = 0;
        this.numbersArr = [1,2,3,4,5,6,7,8,9,10];

        this.correctAnswer = null;
        this.base = null;
        this.upperNum = null;
        this.submitedAnswer = null;

        this.setNumbers();
        this.bindEvents();
    }

    grabElements(){
        this.elem.upper = document.querySelector('.upper');
        this.elem.base = document.querySelector('.base-number');
        this.elem.answer = document.querySelector('.answer');
        this.form = document.getElementById('subAnswer');
    }

    setNumbers(){
        // Set upper number
        this.upperNum = this.randNum();
        this.base = parseInt(this.levels.currentLevel);
        this.correctAnswer = this.upperNum * this.base;
        this.render();
    }

    bindEvents(){
        if(!this.eventsBound){
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitedAnswer = parseInt(this.elem.answer.value.trim());
                this.checkAnswer();
            });
            this.eventsBound = true;
        }
    }

    render(){
        this.updateElement('upper', this.upperNum);
        this.updateElement('base', this.base);
        consecBoard.updateValue(this.consecutiveWins);
    }

    updateElement(elem, value){
        this.elem[`${elem}`].innerText = `${value}`
    }

    randNum(){
        let index = Math.floor(Math.random() * this.numbersArr.length);
        let num = this.numbersArr[index];
        this.numbersArr.splice(index, 1);
        return num;
    }

    checkAnswer(){
        console.log(game.incorrectAnswers);
        console.log(game.numbersArr);

        // Check if answer is correct
        if(this.correctAnswer !== this.submitedAnswer){
            this.incorrectAnswers.push(this.elem.upper.innerText);
            alert('Sorry, the correct answer is: ' + this.correctAnswer);
        } else {
            alert('Great Job');
        }

        // Check for win
        if(this.numbersArr.length === 0 && this.incorrectAnswers.length === 0){
            // debugger;
            this.incConsecutiveVal();
            if(this.consecutiveWins < 3) {
                alert(`Congratulations, YOU WIN.  \n\nWin ${3 - this.consecutiveWins} times in a row to advance to the next level`);
                this.init();
            } else {
                alert(`Congratulations, YOU WIN.  \n\nYou are now Level ${this.levels.currentLevel + 1}`);                
            }
            this.init();
        } else if(this.numbersArr.length === 0){
            alert(`You Lose, GAME OVER`);
            alert(`These are the numbers you got wrong for the ${this.levels.currentLevel} times table: \n${this.incorrectAnswers}`);
            this.init();
            return;
        }

        // Check for 3 consecutive wins and inc level if so
        if(this.consecutiveWins >= 3){
            this.incLevel();
            return;
        }

        // Clear answer
        this.elem.answer.value = '';

        // Proceed to next equation
        this.setNumbers();
    }

    incLevel(){
        this.levels.incLevel();
        this.init();
        this.resetConsecutive();
    }

    incConsecutiveVal(){
        this.consecutiveWins++;
        consecBoard.updateValue(this.consecutiveWins);
    }

    resetConsecutive(){
        this.consecutiveWins = 0;
        consecBoard.updateValue(this.consecutiveWins);
    }
}

class ConsecutiveBoard {
    constructor(){
        this.value = 0;
        this.elem = null;
    }

    init(){
        this.grabElements();
    }

    grabElements(){
        this.elem = document.getElementById('consecutiveView');
    }

    updateValue(val){
        this.val = val;
        this.render();
    }

    render(){
        console.log(this.elem)
        this.elem.innerText = this.val;
    }
}

// Messenger Funcs
window.alert = function(msg){
    let messenger = document.getElementById('messenger');
    let message = document.getElementById('message');

    message.innerText = msg;

    showMessenger();
}

let showMessenger = () => {
    let messenger = document.getElementById('messenger');
    messenger.style.display = 'block';
}

let hideMessenger = () => {
    let messenger = document.getElementById('messenger');
    messenger.style.display = 'none';
}

window.onload = () => {
    let messenger = document.querySelector('.close-wrapper');
    messenger.addEventListener('click', () => {
        hideMessenger();
    })
}

let player = new Player();
player.init();

let levels = new Levels(player);

let consecBoard = new ConsecutiveBoard();
consecBoard.init();

let game = new Game(levels);
game.init();

