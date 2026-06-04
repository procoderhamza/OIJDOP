const Calculator = {
    display: null,
    currentValue: '0',

    init() {
        this.display = document.getElementById('calc-display');
        this.renderButtons();
    },

    renderButtons() {
        const grid = document.querySelector('.calc-grid');
        if (!grid) return;

        const buttons = [
            'C', 'sin', 'cos', 'tan',
            '7', '8', '9', '/',
            '4', '5', '6', '*',
            '1', '2', '3', '-',
            '0', '.', '=', '+'
        ];

        buttons.forEach(btn => {
            const b = document.createElement('button');
            b.textContent = btn;
            b.className = 'calc-btn';
            if (['/', '*', '-', '+', '='].includes(btn)) b.classList.add('op');
            if (['sin', 'cos', 'tan'].includes(btn)) b.classList.add('sci');
            if (btn === 'C') b.classList.add('clear');

            b.onclick = () => this.handlePress(btn);
            grid.appendChild(b);
        });
    },

    handlePress(btn) {
        if (btn === 'C') {
            this.currentValue = '0';
        } else if (btn === '=') {
            try {
                // Strict math check
                let expr = this.currentValue.replace(/sin/g, 'Math.sin')
                                            .replace(/cos/g, 'Math.cos')
                                            .replace(/tan/g, 'Math.tan');

                // Security check
                if (/^(?:[0-9+\-*/.()]|Math\.(?:sin|cos|tan))*$/.test(expr)) {
                     this.currentValue = eval(expr).toString();
                } else {
                    this.currentValue = "Error";
                }
            } catch (e) {
                this.currentValue = 'Error';
            }
        } else {
            if (this.currentValue === '0' && !isNaN(btn)) {
                this.currentValue = btn;
            } else {
                this.currentValue += btn;
            }
        }
        this.updateDisplay();
    },

    updateDisplay() {
        this.display.textContent = this.currentValue;
    },

    clear() {
        this.currentValue = '0';
        this.updateDisplay();
    },

    append(val) {
        this.handlePress(val);
    },

    solve() {
        this.handlePress('=');
    }
};

window.calc = Calculator;
document.addEventListener('DOMContentLoaded', () => Calculator.init());
