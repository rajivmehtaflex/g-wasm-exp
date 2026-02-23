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

function setupUI() {
    const numberAInput = document.getElementById('numberA');
    const numberBInput = document.getElementById('numberB');
    const resultSpan = document.getElementById('result-value');
    const opButtons = document.querySelectorAll('.op-btn');

    function formatResult(value) {
        if (!Number.isFinite(value)) {
            return 'Error';
        }
        // Use toPrecision to limit significant digits, then remove trailing zeros
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

    async function calculate() {
        const a = parseFloat(numberAInput.value) || 0;
        const b = parseFloat(numberBInput.value) || 0;

        // Find current operation based on button state
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
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    op: currentOp,
                    a: a,
                    b: b
                })
            });

            const data = await response.json();

            if (data.error) {
                resultSpan.textContent = 'Error';
                resultSpan.classList.add('error');
            } else {
                const formatted = formatResult(data.result);
                resultSpan.textContent = formatted;
                resultSpan.classList.remove('error');
            }
        } catch (error) {
            console.error('Calculation error:', error);
            resultSpan.textContent = 'Error';
            resultSpan.classList.add('error');
        }
    }

    // Set up button click handlers
    opButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const opName = btn.dataset.op;
            updateButtonState(opName);

            // Update button visual state
            opButtons.forEach(b => b.style.boxShadow = '');
            btn.style.boxShadow = '0 0 0 3px rgba(91, 168, 224, 0.3)';

            calculate();
        });
    });

    // Initialize with first button state
    updateButtonState('add');
    resultSpan.textContent = '0';
}

// Set up UI on page load
setupUI();
