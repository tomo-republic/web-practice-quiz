const QuizType = { ADDITION: 0, SUBSTRACTION: 1, UNIT_CONV: 2 };
const Result   = { CORRECT: 0, INCORRECT: 1, CLEAR: 2 };

/* Utility functions */
function selectRandom(anyArray) {
    return anyArray[Math.floor(Math.random() * Math.floor(anyArray.length))];
}
/* ----------------- */

class Question {
    constructor(){
        this.questionText = '';
        this.correct = '';
        this.options = null;
    }
}

class QuestionCreator {
    static createAddiction(level) {
        var quest = new Question();
        var [A_MAX, B_MAX] = (level == 1) ? [5,  5]
                           : (level == 2) ? [10, 10]
                           : (level == 3) ? [20, 10]
                           : (level == 4) ? [20, 20]
                           :                [50, 50];
        var a = Math.floor(Math.random() * A_MAX);
        var b = Math.floor(Math.random() * B_MAX);
        quest.questionText = a.toString() + ' + ' + b.toString() + ' = ？';
        quest.correct  = a + b;
        return quest;
    }

    static createSubstraction(level) {
        var quest = new Question();
        var [A_MAX, B_MAX] = (level == 1) ? [5,  5]
                           : (level == 2) ? [10, 10]
                           : (level == 3) ? [20, 10]
                           : (level == 4) ? [20, 20]
                           :                [50, 50];
        var a = Math.floor(Math.random() * Math.floor(A_MAX/2)) + Math.floor(A_MAX/2);
        var b = Math.floor(Math.random() * Math.min(B_MAX, a));
        quest.questionText = a.toString() + ' - ' + b.toString() + ' = ？';
        quest.correct  = a - b;
        return quest;
    }

    static createUnitConvert(level) {
        const QUESTIONS = [
            ['mm', 'm',  0], ['m',  'mm', 5], ['cm', 'm',  1], ['m',  'cm', 4],
            ['mm', 'cm', 2], ['cm', 'mm', 3], ['L',  'dL', 3], ['dL', 'L',  2],
            ['L',  'mL', 5], ['mL', 'L',  0], ['mL', 'dL', 1], ['dL', 'mL', 4],
            ['kg', 'g',  5], ['g',  'kg', 0]
        ];
        var res = selectRandom(QUESTIONS);
        var quest = new Question();
        quest.questionText = '1' + res[0] + 'は何' + res[1] + 'かな？';
        quest.options = Array(6);
        quest.options[0] = '0.001 ' + res[1];
        quest.options[1] = '0.01 '  + res[1];
        quest.options[2] = '0.1 '   + res[1];
        quest.options[3] = '10 '    + res[1];
        quest.options[4] = '100 '   + res[1];
        quest.options[5] = '1000 '  + res[1];
        quest.correct = quest.options[res[2]];
        return quest;
    }
}

class QuizManager {
    constructor(quizNum, quizType) {
        this.quizType = quizType;
        this.quizNum = quizNum;
        this.question = null;
        this.index = 0;
        this.level = 1;
    }
  
    initQuiz(level=1) {
        this.index = 0;
        this.level = level;
    }

    getNextQuestion() {
        this.index++;
        this.question = (this.quizType == QuizType.ADDITION)     ? QuestionCreator.createAddiction(this.level)
                      : (this.quizType == QuizType.SUBSTRACTION) ? QuestionCreator.createSubstraction(this.level)
                      :                                            QuestionCreator.createUnitConvert(this.level);
        this.question.questionText = this.index.toString() + '問目. ' 
                                   + this.question.questionText;
        return this.question;
    }

    getQuestionOptions() {
        return this.question.options;
    }

    ask(answer) {
        if (answer != this.question.correct) {
            return Result.INCORRECT;
        } else {
            if (this.index < this.quizNum) {
                return Result.CORRECT;
            } else {
                return Result.CLEAR;
            }
        }
    }
}
