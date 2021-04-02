class TenKey {
    constructor() {
        this.parent = null;
        this.answerButton = null;
        this.display;
    }

    create(parentElement, answerEventFunction=null) {
        this.parent = parentElement;
        var self = this;
        this.parent.style.display = 'grid';
        this.parent.style.gridTemplateRows = '33% 33% 34%';
        this.parent.style.gridTemplateColumns = '20% 20% 20% 20% 20%';
        this.display = this.__createDisplay(parentElement);
        this.__createNumKeys(parentElement);
        this.__createDeleteKey(parentElement);
        this.answerButton = this.__createAnswerButton(parentElement, answerEventFunction);
    }

    __createDisplay(parentElement) {
        var label = document.createElement('label');
        label.classList.add('ten-key-disp');
        label.innerHTML = '0';
        label.style.margin = 'auto';
        label.style.gridRow = 3;
        label.style.gridColumn = '1/4';
        parentElement.appendChild(label);
        return label;
    }

    __createNumKeys(parentElement) {
        var self = this;
        for(let i = 0; i < 10; i++) {
            var button = document.createElement('button');
            button.style.gridRow = Math.floor(i / 5) + 1;
            button.style.gridColumn = (i % 5) + 1;
            button.innerHTML = ((i + 1) % 10).toString();
            button.addEventListener('click', () => self.__addNum((i + 1) % 10));
            parentElement.appendChild(button);
        }
    }

    __createDeleteKey(parentElement) {
        var self = this;
        var button = document.createElement('button');
        button.style.gridRow = 3;
        button.style.gridColumn = 4;
        button.innerHTML = '←';
        button.addEventListener('click', () => self.__deleteNum());
        parentElement.appendChild(button);
        return button;
    }

    __createAnswerButton(parentElement, answerEventFunction) {
        var button = document.createElement('button');
        button.style.gridRow = 3;
        button.style.gridColumn = 5;
        button.innerHTML = 'OK';
        if (answerEventFunction) {
            button.addEventListener('click', function() { answerEventFunction(); });
        }
        parentElement.appendChild(button);
        return button;
    }

    __addNum(num) {
        var buf = parseInt(this.display.innerHTML, 10);
        buf = (buf == 0)     ? num
            : (buf >= 10000) ? buf // 5桁まで
            : buf * 10 + num;
        this.display.innerHTML = buf.toString();
    }

    __deleteNum() {
        if (this.display.innerHTML.length <= 1) {
            this.display.innerHTML = '0';
        } else {
            this.display.innerHTML = this.display.innerHTML.slice(0, -1);
        }
    }

    getValue() {
        return parseInt(this.display.innerHTML, 10);
    }

    clearValue() {
        this.display.innerHTML = '0';
    }
}


class OptionButtons {
    constructor() {
        this.parent = null;
        this.buttons = null;
    }

    create(parentElement, options, foldNum, buttonClickFunction=null) {
        this.parent = parentElement;
        var self = this;
        this.__setGrid(this.parent, options.length, foldNum);
        this.buttons = Array(options.length);
        for (let i = 0; i < options.length; i++) {
            var button = document.createElement('button');
            button.style.gridRow = Math.floor(i / foldNum) + 1;
            button.style.gridColumn = (i % foldNum) + 1;
            button.innerHTML = options[i];
            if (buttonClickFunction) {
                button.addEventListener('click', () => {
                    buttonClickFunction(options[i]);
                });
            }
            this.parent.appendChild(button);
            this.buttons[i] = button;
        }
    }
    __setGrid(element, num, columns) {
        element.style.display = 'grid';
        var rows = Math.ceil(num / columns);
        var rowRate = Math.floor(100 / rows, -1).toString() + '%';
        var columnRate = Math.floor(100 / columns, -1).toString() + '%';
        element.style.gridTemplateRows = Array(rows).fill(rowRate).join(' ');
        element.style.gridTemplateColumns = Array(columns).fill(columnRate).join(' ');
    }
}
