function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function calculate() {
    const count = parseInt(document.getElementById('fraction-count').value);
    const operator = document.getElementById('operator').value;
    let nums = [], dens = [];

    for (let i = 1; i <= count; i++) {
        const whole = parseInt(document.getElementById('whole' + i).value) || 0;
        const num = parseInt(document.getElementById('num' + i).value) || 0;
        const den = parseInt(document.getElementById('den' + i).value);
        if (isNaN(den) || den === 0) {
            document.getElementById("result").innerText = "Denominator must not be empty or zero.";
            return;
        }
        // Convert mixed to improper
        const impNum = Math.abs(whole) * den + num;
        nums.push(whole < 0 ? -impNum : impNum);
        dens.push(den);
    }

    let resultNum = nums[0];
    let resultDen = dens[0];

    for (let i = 1; i < count; i++) {
        switch (operator) {
            case "+":
                // Find common denominator
                let commonDen = lcm(resultDen, dens[i]);
                resultNum = resultNum * (commonDen / resultDen) + nums[i] * (commonDen / dens[i]);
                resultDen = commonDen;
                break;
            case "-":
                let commonDen2 = lcm(resultDen, dens[i]);
                resultNum = resultNum * (commonDen2 / resultDen) - nums[i] * (commonDen2 / dens[i]);
                resultDen = commonDen2;
                break;
            case "*":
                resultNum *= nums[i];
                resultDen *= dens[i];
                break;
            case "/":
                if (nums[i] === 0) {
                    document.getElementById("result").innerText = "You can't divide by zero!";
                    return;
                }
                resultNum *= dens[i];
                resultDen *= nums[i];
                break;
            default:
                document.getElementById("result").innerText = "Not a valid operation";
                return;
        }
    }

    // Keep denominator positive
    if (resultDen < 0) {
        resultNum = -resultNum;
        resultDen = -resultDen;
    }

    // Simplify
    const simplifyGCD = gcd(Math.abs(resultNum), Math.abs(resultDen));
    resultNum /= simplifyGCD;
    resultDen /= simplifyGCD;

    // Convert to mixed fraction if improper
    // Always show as improper fraction (default fraction)
    let resultStr;
    if (resultDen === 1) {
        resultStr = `Hasil: ${resultNum}`;
    } else if (resultNum === 0) {
        resultStr = "Hasil: 0";
    } else {
        resultStr = `Hasil: ${resultNum}/${resultDen}`;
    }

    document.getElementById("result").innerText = resultStr;
}

function switchMode() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  document.getElementById('operate-section').style.display = mode === 'operate' ? '' : 'none';
  document.getElementById('convert-section').style.display = mode === 'convert' ? '' : 'none';
  document.getElementById('decimal-section').style.display = mode === 'decimal' ? '' : 'none';
}

function convertMixed() {
  const whole = parseInt(document.getElementById("conv_whole").value) || 0;
  const num = parseInt(document.getElementById("conv_num").value) || 0;
  const den = parseInt(document.getElementById("conv_den").value);
  if (isNaN(den) || den === 0) {
    document.getElementById("convert-result").innerText = "Invalid denominator!";
    return;
  }
  const improper = whole * den + num;
  document.getElementById("convert-result").innerText = `Improper: ${improper}/${den}`;
}

function convertDecimal() {
  const num = parseInt(document.getElementById("dec_num").value);
  const den = parseInt(document.getElementById("dec_den").value);
  if (isNaN(num) || isNaN(den) || den === 0) {
    document.getElementById("decimal-result").innerText = "Invalid input!";
    return;
  }
  document.getElementById("decimal-result").innerText = `Decimal: ${num/den}`;
}

function updateFractionInputs() {
    const count = parseInt(document.getElementById('fraction-count').value);
    for (let i = 3; i <= 4; i++) {
        document.getElementById('fraction' + i).style.display = (i <= count) ? '' : 'none';
    }
}

function toggleMode() {
  // Get all radio buttons
  const radios = document.querySelectorAll('.mode-select input[type="radio"]');
  // Find the currently checked one
  let currentIndex = Array.from(radios).findIndex(r => r.checked);
  // Calculate next index (cycle)
  let nextIndex = (currentIndex + 1) % radios.length;
  // Set the next radio as checked
  radios[nextIndex].checked = true;
  // Call switchMode to update UI
  switchMode();
}

function showAboutModal() {
  document.getElementById('about-modal').style.display = 'flex';
}
function closeAboutModal() {
  document.getElementById('about-modal').style.display = 'none';
}

