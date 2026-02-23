const operationMap = {
    add: { needsB: true },
    subtract: { needsB: true },
    multiply: { needsB: true },
    divide: { needsB: true },
    sqrt_a: { needsB: false },
    power: { needsB: true },
    percentage: { needsB: true },
    modulo: { needsB: true }
};

async function main() {
    const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pyodide.mjs');
    const pyodide = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.3/full/' });

    const code = await fetch('./calculator.py').then(r => r.text());
    pyodide.runPython(code);

    const pyFns = {};
    for (const name of ['add', 'subtract', 'multiply', 'divide', 'sqrt_a', 'power', 'percentage', 'modulo']) {
        pyFns[name] = pyodide.globals.get(name);
    }

    setupUI(pyFns);
}

function setupUI(pyFns) {
    const numberAInput = document.getElementById('numberA');
    const numberBInput = document.getElementById('numberB');
    const resultSpan = document.getElementById('result-value');
    const opButtons = document.querySelectorAll('.op-btn');

    function formatResult(value) {
        if (!Number.isFinite(value)) {
            return 'Error';
        }
        const formatted = parseFloat(value.toPrecision(10)).toString();
        return formatted;
    }

    function updateButtonState(opName) {
        const op = operationMap[opName];
        if (!op) return;

        if (op.needsB) {
            numberBInput.style.opacity = '1';
            numberBInput.style.pointerEvents = 'auto';
        } else {
            numberBInput.style.opacity = '0.35';
            numberBInput.style.pointerEvents = 'none';
        }
    }

    function calculate() {
        const a = parseFloat(numberAInput.value) || 0;
        const b = parseFloat(numberBInput.value) || 0;

        let currentOp = null;
        opButtons.forEach(btn => {
            if (btn.style.boxShadow && btn.style.boxShadow !== '') {
                currentOp = btn.dataset.op;
            }
        });

        if (!currentOp) {
            resultSpan.textContent = '0';
            resultSpan.classList.remove('error');
            return;
        }

        const op = operationMap[currentOp];
        if (!op) {
            resultSpan.textContent = 'Error';
            resultSpan.classList.add('error');
            return;
        }

        try {
            const pyFn = pyFns[currentOp];
            const result = op.needsB ? pyFn(a, b) : pyFn(a);
            const formatted = formatResult(result);
            if (formatted === 'Error') {
                resultSpan.textContent = 'Error';
                resultSpan.classList.add('error');
            } else {
                resultSpan.textContent = formatted;
                resultSpan.classList.remove('error');
            }
        } catch (error) {
            console.error('Calculation error:', error);
            resultSpan.textContent = 'Error';
            resultSpan.classList.add('error');
        }
    }

    opButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const opName = btn.dataset.op;
            updateButtonState(opName);
            opButtons.forEach(b => b.style.boxShadow = '');
            btn.style.boxShadow = '0 0 0 3px rgba(91, 168, 224, 0.3)';
            calculate();
        });
    });

    numberAInput.addEventListener('input', calculate);
    numberBInput.addEventListener('input', calculate);

    updateButtonState('add');
    resultSpan.textContent = '0';
}

main().catch(console.error);
