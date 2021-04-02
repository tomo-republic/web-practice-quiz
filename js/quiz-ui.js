const ImageType = {CORRECT: 0, INCORRECT: 1, CLEAR: 2, QUESTION: 3, TITLE: 4};
const UiType = {OPTIONS: 0, TEN_KEY: 1};

/* Utility functions */
function selectRandom(anyArray) {
    return anyArray[Math.floor(Math.random() * Math.floor(anyArray.length))];
}

function zeroPadding(value, length) {
    return ('0000000000' + value).slice(-length);
}

function getParam(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
/* ----------------- */

class CharaImage{
    constructor(tagId) {
        this.id = tagId;
        this.image = document.getElementById(tagId);
        this.resource = new Map();
        this.resource.set(ImageType.TITLE,     this.__getResources('images/title/',    4));
        this.resource.set(ImageType.CORRECT,   this.__getResources('images/correct/',  6));
        this.resource.set(ImageType.INCORRECT, this.__getResources('images/mistake/',  4));
        this.resource.set(ImageType.CLEAR,     this.__getResources('images/prize/',    4));
        this.resource.set(ImageType.QUESTION,  this.__getResources('images/question/', 6));
    }
    __getResources(searchPath, num) {
        var images = new Array();
        for (let i = 0; i < num; i++) {
            var image = new Image();
            image.src = searchPath + zeroPadding(i, 3) + '.png';
            images.push(image);
        }
        return images;
    }

    clearChara() {
        this.image.src = null;
    }

    drawChara(imageType) {
        var imdiv = document.getElementById('image-area');
        imdiv.innerHTML = '';
        var res = this.resource.get(imageType);
        imdiv.appendChild(selectRandom(res));
    }
}

class ButtonArea {
    constructor(id) {
        this.id = id;
        this.div = document.getElementById(this.id);
        this.displayState = this.div.style.display;
    }

    appendButton(classes) {
        var button = document.createElement('button');
        if (classes) {
            classes.split(' ').forEach(e => button.classList.add(e));
        }
        this.div.appendChild(button);
        return button;
    }
    
    clearChildren() {
        this.div.innerHTML = '';
    }

    memoryCurrentDisplay() {
        this.displayState = this.div.style.display;
    }

    hide() {
        this.div.style.display = 'none';
    }

    show() {
        this.div.style.display = this.displayState;
    }
}

class UI {
    constructor(quizType) {
        this.quizType = quizType;
        this.uiType = this.__uiType(this.quizType);
        this.message = document.getElementById('message');
        this.image = new CharaImage('image');
        this.startButtons = new ButtonArea('start-button-area');
        this.nextButton = new ButtonArea('next-button-area');
        this.optionArea = new ButtonArea('option-area');
        this.quiz = new QuizManager(5, quizType);
    }
    __uiType(quizType) {
        switch(quizType) {
            case QuizType.ADDITION:
            case QuizType.SUBSTRACTION:
                return UiType.TEN_KEY;
            case QuizType.UNIT_CONV:
                return UiType.OPTIONS;
            default:
                return UiType.TEN_KEY;
        }
    }

    createUI() {
        this.createNextButton();
        this.nextButton.hide();
        switch (this.quizType) {
            case QuizType.ADDITION:
                this.createStartButtonsWithLevels(5);
                break;
            case QuizType.SUBSTRACTION:
                this.createStartButtonsWithLevels(5);
                break;
            case QuizType.UNIT_CONV:
                this.createStartButton();
                break;
        }
    }
    createStartButtonsWithLevels(levels) {
        this.startButtons.clearChildren();
        var self = this;
        for (let i = 0; i < levels; i++) {
            var button = this.startButtons.appendButton();
            button.innerHTML = 'レベル' + (i + 1).toString();
            button.addEventListener('click', () => {
                self.quiz.initQuiz(i + 1);
                self.showQuestion();
            });
        }
    }
    createStartButton() {
        this.startButtons.clearChildren();
        var self = this;
        var button = this.startButtons.appendButton();
        button.innerHTML = 'はじめる';
        button.addEventListener('click', () => {
            self.quiz.initQuiz(1);
            self.showQuestion();
        });
    }

    createNextButton() {
        this.nextButton.clearChildren();
        var self = this;
        var button = this.nextButton.appendButton();
        button.innerHTML = 'つぎの問題';
        button.addEventListener('click', () => {
            self.showQuestion();
        });
    }

    showTitle() {
        this.nextButton.hide();
        this.optionArea.hide();
        this.quiz.initQuiz(1);
        this.message.innerHTML = this.__title(this.quizType);
        this.image.drawChara(ImageType.TITLE);
        this.startButtons.show();
    }

    __title(quizType) {
        return this.quizType == QuizType.ADDITION     ? 'たしざんクイズ！'
             : this.quizType == QuizType.SUBSTRACTION ? 'ひきざんクイズ！'
             :                                          '単位クイズ！';
    }
    
    showQuestion() {
        var self = this;
        this.nextButton.hide();
        this.startButtons.hide();
        this.optionArea.clearChildren();
        var question = this.quiz.getNextQuestion();
        this.__createOptionArea(this.uiType, question);
        this.optionArea.show();
        this.image.drawChara(ImageType.QUESTION);
        this.message.innerHTML = question.questionText;
    }
    __createOptionArea(uiType, question) {
        var self = this;
        switch (uiType) {
            case UiType.OPTIONS:
                var optionButtons = new OptionButtons();
                var buttons = optionButtons.create(this.optionArea.div, question.options, 3);
                for (let i = 0; i < question.options.length; i++) {
                    optionButtons.buttons[i].addEventListener('click', function() {
                        self.showResult(question.options[i]);
                    });
                }
                break;
            default:
                var tenKey = new TenKey();
                tenKey.create(this.optionArea.div);
                tenKey.answerButton.addEventListener('click', () => {
                    self.showResult(tenKey.getValue());
                });
                break;
        }
        this.optionArea.memoryCurrentDisplay();
    }

    showResult(answer) {
        var result = this.quiz.ask(answer);
        this.startButtons.hide();
        this.optionArea.hide();
        switch (result) {
            case Result.CORRECT:
                this.message.innerHTML = 'せいかーい！';
                this.image.drawChara(ImageType.CORRECT);
                this.nextButton.show();
                break;
            case Result.CLEAR:
                this.message.innerHTML = 'クリア！おめでとう！！';
                this.image.drawChara(ImageType.CLEAR);
                this.nextButton.hide();
                break;
            default:
                this.message.innerHTML = 'ざんねん...。';
                this.image.drawChara(ImageType.INCORRECT);
                this.nextButton.hide();
                break;
        }
    }

    setPersistentEvents() {
        var button = document.getElementById('to-title');
        var self = this;
        button.addEventListener('click', function() {
            self.showTitle();
        });
    }

    run() {
        this.createUI();
        this.showTitle();
        this.setPersistentEvents();
    }
}

window.onload = function() {
    var qt = getParam('qt');
    var quizType = qt == 'add'  ? QuizType.ADDITION
                 : qt == 'sub'  ? QuizType.SUBSTRACTION
                 : qt == 'unit' ? QuizType.UNIT_CONV
                 :                QuizType.ADDITION;
    var ui = new UI(quizType);
    ui.run();
}
