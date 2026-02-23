import init, {
    add,
    subtract,
    multiply,
    divide,
    sqrt_a,
    power,
    percentage,
    modulo
} from './pkg/calculator.js';

const operationMap = {
    add: { fn: add, needsB: true },
    subtract: { fn: subtract, needsB: true },
    multiply: { fn: multiply, needsB: true },
    divide: { fn: divide, needsB: true },
    sqrt_a: { fn: sqrt_a, needsB: false },
    power: { fn: power, needsB: true },
    percentage: { fn: percentage, needsB: true },
    modulo: { fn: modulo, needsB: true }
};

let wasmReady = false;

async function boot() {
    try {
        await init();
        wasmReady = true;
        console.log('WASM module loaded successfully');
        setupUI();
    } catch (error) {
        console.error('Failed to load WASM module:', error);
        document.getElementById('result-value').textContent = 'Error loading WASM';
    }
}

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

    function calculate() {
        if (!wasmReady) {
            resultSpan.textContent = 'Loading...';
            resultSpan.classList.add('error');
            return;
        }

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

        const result = op.fn(a, b);
        const formatted = formatResult(result);

        if (formatted === 'Error') {
            resultSpan.textContent = 'Error';
            resultSpan.classList.add('error');
        } else {
            resultSpan.textContent = formatted;
            resultSpan.classList.remove('error');
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

    // Set up input event listeners for live calculation
    numberAInput.addEventListener('input', calculate);
    numberBInput.addEventListener('input', calculate);

    // Initialize with first button state
    updateButtonState('add');
    resultSpan.textContent = '0';
}

// Boot the WASM module on page load
boot();
