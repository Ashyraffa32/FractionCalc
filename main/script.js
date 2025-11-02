// DOM elements
const ribbon = document.querySelector('.ribbon');
const modeButtons = document.querySelectorAll('.dropdown-menu button[data-mode]');
const panels = document.querySelectorAll('.panel');
const aboutOpenBtn = document.getElementById('about-open-btn');
const aboutCloseBtn = document.getElementById('about-close-btn');
const aboutModal = document.getElementById('about-modal');
const openDocsBtn = document.getElementById('open-docs-btn');
const fractionCountSelect = document.getElementById('fraction-count');
const toggleThemeBtn = document.getElementById('toggle-theme-btn');
const uploadBgBtn = document.getElementById('upload-bg-btn');
const fileInput = document.getElementById('bg-upload');
const resetBgBtn = document.getElementById('reset-bg-btn');
const accentColorPicker = document.getElementById('accent-color-picker');
const changeAccentBtn = document.getElementById('change-accent-btn');
const opacitySlider = document.getElementById('opacity-slider');
const openOpacityModalBtn = document.getElementById('open-opacity-modal-btn');
const opacityModal = document.getElementById('opacity-modal');
const opacityCloseBtn = document.getElementById('opacity-close-btn');
const showExplanationCheckbox = document.getElementById('show-explanation-checkbox');
const explanationBox = document.getElementById('explanation-box');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const conv_whole = document.getElementById('conv_whole');
const conv_num = document.getElementById('conv_num');
const conv_den = document.getElementById('conv_den');
const dec_num = document.getElementById('dec_num');
const dec_den = document.getElementById('dec_den');
const dec_input_fraction = document.getElementById('dec_input_fraction');
const simp_num = document.getElementById('simp_num');
const simp_den = document.getElementById('simp_den');

// --- State Variable ---
let latestExplanation = ''; // <-- FIX #1: Declare variable in a scope all functions can access

// --- Localization strings ---
const locales = {
  en: {
    conv_whole: "Whole",
    conv_num: "Numerator",
    conv_den: "Denominator",
    dec_input_fraction: "Enter a decimal...",
    dec_num: "Numerator",
    dec_den: "Denominator", 
    showExplanationCheckbox: "Show Explanation",
    fullscreenBtn: "Toggle Fullscreen",
    mode: "Mode",
    operate: "Operate Fractions",
    convert: "Mixed ↔ Improper",
    decimal: "Fraction → Decimal",
    fraction: "Decimal → Fraction",
    simplify: "Simplify Fraction",
    options: "Options",
    toggleTheme: "Toggle Theme",
    changeWallpaper: "Change Wallpaper...",
    resetWallpaper: "Reset to Default",
    switchLang: "Switch Language",
    accentColor: "Change Accent Color...",
    opacity: "Adjust Container Opacity...",
    help: "Help",
    about: "About",
    aboutMsg: "FractionCalc For Desktop\nVersion 1.6.0\nMade by Ashyraffa and Ratu",
    documentation: "Documentation",
    view: "View",
    howMany: "How many fractions?",
    calculate: "Calculate",
    result: "Result:",
    hint: "Leave \"Whole\" empty or 0 for proper fractions. Fill \"Whole\" for mixed numbers.",
    convertBtn: "Convert",
    improper: "Improper Fraction:",
    invalidDen: "Denominator must not be empty or zero.",
    invalidInput: "Invalid input!",
    cannotDivide: "Cannot divide by zero!",
    toDecimal: "To Decimal",
    decimalResult: "Decimal:",
    decToFrac: "Convert to Fraction",
    decFracResult: "Result:",
    invalidDecimal: "Invalid input.",
    viewHistoryBtn: "View History",
    historyTitle: "Calculation History",
    clearHistoryBtn: "Clear History",
    opacityTitle: "Set Container Opacity",
    simp_den: "Denominator",
    simp_num: "Numerator",
    btnSimplify: "Simplify",
    simplifyResult: "Simplified:",
    // Explanation Strings
    expStep1: "Step 1: Convert all mixed numbers to improper fractions.",
    expMixedToImproper: "  - F{i}: {whole} {num}/{den} = ({whole} * {den} + {num})/{den} = {impNum}/{den}",
    expIsProper: "  - F{i}: {num}/{den} is a proper fraction.",
    expStep2: "Step 2: Perform the operation: {expression}",
    expCalcStep: "\nCalculation {i}: ({num1}/{den1}) {op} ({num2}/{den2})",
    expFindLCM: "  - Find a common denominator (LCM of {den1} and {den2}): {lcm}",
    expAdjustFractions: "  - Adjust fractions: ({num1}/{den1}) = ({newNum1}/{lcm}), ({num2}/{den2}) = ({newNum2}/{lcm})",
    expPerformOp: "  - Perform operation: ({newNum1} {op} {newNum2}) / {lcm}",
    expMultiplyNumerators: "  - Multiply numerators: {num1} * {num2} = {resNum}",
    expMultiplyDenominators: "  - Multiply denominators: {den1} * {den2} = {resDen}",
    expInvertAndMultiply: "  - Invert the second fraction and multiply: ({num1}/{den1}) * ({den2}/{num2})",
    expIntermediateResult: "  - Intermediate Result: {num}/{den}",
    expStep3: "Step 3: Simplify the final fraction: {num}/{den}",
    expFindGCD: "  - Find the Greatest Common Divisor (GCD) of {num} and {den}: {gcd}",
    expDivideByGCD: "  - Divide both numerator and denominator by the GCD:",
    expDivideNumerator: "  - {num} / {gcd} = {resNum}",
    expDivideDenominator: "  - {den} / {gcd} = {resDen}",
    expSimplestForm: "  - The fraction is already in its simplest form."
  },
  id: {
    conv_whole: "Bilangan Utuh",
    conv_num: "Pembilang",
    conv_den: "Penyebut",
    dec_input_fraction: "Masukkan desimal...",
    dec_num: "Pembilang",
    dec_den: "Penyebut",
    showExplanationCheckbox: "Penjelasan/Cara",
    fullscreenBtn: "Beralih ke Layar Penuh", 
    mode: "Mode",
    operate: "Operasi Pecahan",
    convert: "Campuran ↔ Tidak Biasa",
    decimal: "Pecahan → Desimal",
    fraction: "Desimal → Pecahan",
    simplify: "Sederhanakan Pecahan",
    options: "Opsi",
    toggleTheme: "Ganti Tema",
    changeWallpaper: "Ganti Wallpaper...",
    resetWallpaper: "Kembali ke Default",
    accentColor: "Ganti Warna Aksen...",
    opacity: "Sesuaikan Opasitas Kontainer...",
    switchLang: "Ganti Bahasa",
    help: "Bantuan",
    about: "Tentang",
    aboutMsg: "FractionCalc Untuk Desktop\nVersi 1.6.0\nDibuat oleh Ashyraffa dan Ratu",
    documentation: "Dokumentasi",
    view: "Tampilan",
    howMany: "Berapa banyak pecahan?",
    calculate: "Hitung",
    result: "Hasil:",
    hint: "Kosongkan \"Whole\" atau isi 0 untuk pecahan biasa. Isi \"Whole\" untuk pecahan campuran.",
    convertBtn: "Konversi",
    improper: "Pecahan Tidak Biasa:",
    invalidDen: "Penyebut tidak boleh kosong atau nol.",
    invalidInput: "Input tidak valid!",
    cannotDivide: "Tidak dapat membagi dengan nol!",
    toDecimal: "Ke Desimal",
    decimalResult: "Desimal:",
    decToFrac: "Konversi ke Pecahan",
    decFracResult: "Hasil:",
    invalidDecimal: "Input tidak valid.",
    viewHistoryBtn: "Lihat Riwayat",
    historyTitle: "Riwayat Perhitungan",
    clearHistoryBtn: "Hapus Riwayat",
    opacityTitle: "Atur Opasitas Kontainer",
    simp_den: "Penyebut",
    simp_num: "Pembilang",
    btnSimplify: "Sederhanakan",
    simplifyResult: "Disederhanakan:",
    // Explanation Strings
    expStep1: "Langkah 1: Ubah semua bilangan campuran menjadi pecahan biasa.",
    expMixedToImproper: "  - P{i}: {whole} {num}/{den} = ({whole} * {den} + {num})/{den} = {impNum}/{den}",
    expIsProper: "  - P{i}: {num}/{den} sudah merupakan pecahan biasa.",
    expStep2: "Langkah 2: Lakukan operasi: {expression}",
    expCalcStep: "\nPerhitungan {i}: ({num1}/{den1}) {op} ({num2}/{den2})",
    expFindLCM: "  - Cari penyebut yang sama (KPK dari {den1} dan {den2}): {lcm}",
    expAdjustFractions: "  - Sesuaikan pecahan: ({num1}/{den1}) = ({newNum1}/{lcm}), ({num2}/{den2}) = ({newNum2}/{lcm})",
    expPerformOp: "  - Lakukan operasi: ({newNum1} {op} {newNum2}) / {lcm}",
    expMultiplyNumerators: "  - Kalikan pembilang: {num1} * {num2} = {resNum}",
    expMultiplyDenominators: "  - Kalikan penyebut: {den1} * {den2} = {resDen}",
    expInvertAndMultiply: "  - Balikkan pecahan kedua dan kalikan: ({num1}/{den1}) * ({den2}/{num2})",
    expIntermediateResult: "  - Hasil Sementara: {num}/{den}",
    expStep3: "Langkah 3: Sederhanakan pecahan akhir: {num}/{den}",
    expFindGCD: "  - Cari Pembagi Persekutuan Terbesar (FPB) dari {num} dan {den}: {gcd}",
    expDivideByGCD: "  - Bagi pembilang dan penyebut dengan FPB:",
    expDivideNumerator: "  - {num} / {gcd} = {resNum}",
    expDivideDenominator: "  - {den} / {gcd} = {resDen}",
    expSimplestForm: "  - Pecahan sudah dalam bentuk paling sederhana."
  }
};

// --- Localization UI update ---
function applyLocale() {
  const lang = localStorage.getItem('locale') || 'en';
  const t = locales[lang];

  // Ribbon
  document.querySelectorAll('.dropdown')[0].querySelector('button').innerText = t.mode;
  const modeBtns = document.querySelectorAll('.dropdown-menu button[data-mode]');
  modeBtns[0].innerText = t.operate;
  modeBtns[1].innerText = t.convert;
  modeBtns[2].innerText = t.decimal;
  modeBtns[3].innerText = t.fraction;
  modeBtns[4].innerText = t.simplify; 

  document.querySelectorAll('.dropdown')[1].querySelector('button').innerText = t.options;
  document.getElementById('toggle-theme-btn').innerText = t.toggleTheme;
  document.getElementById('upload-bg-btn').innerText = t.changeWallpaper;
  document.getElementById('reset-bg-btn').innerText = t.resetWallpaper;
  document.getElementById('toggle-lang-btn').innerText = t.switchLang;
  document.getElementById('change-accent-btn').innerText = t.accentColor;
  document.getElementById('open-opacity-modal-btn').innerText = t.opacity;

  document.querySelectorAll('.dropdown')[2].querySelector('button').innerText = t.help;
  document.getElementById('about-btn').innerText = t.about;
  document.getElementById('docs-btn').innerText = t.documentation;

  // View dropdown
  document.querySelectorAll('.dropdown')[3].querySelector('button').innerText = t.view;
  document.getElementById('fullscreen-btn').innerText = t.fullscreenBtn;
  
  const viewHistoryBtnEl = document.getElementById('view-history-btn');
  if (viewHistoryBtnEl) viewHistoryBtnEl.innerText = t.viewHistoryBtn;

  // Main UI
  document.querySelector('label[for="fraction-count"]').innerText = t.howMany;
  document.getElementById('calc-btn').innerText = t.calculate;
  
  const hintEl = document.querySelector('.hint');
  if (hintEl) hintEl.innerText = t.hint;
  document.getElementById('btn-convert-mixed').innerText = t.convertBtn;
  document.getElementById('btn-frac-to-dec').innerText = t.toDecimal;
  document.getElementById('btn-dec-to-frac').innerText = t.decToFrac;

  // Checkbox label
  const explanationLabel = document.querySelector('.label-checkbox');
  if (explanationLabel && explanationLabel.lastChild.nodeType === Node.TEXT_NODE) {
    explanationLabel.lastChild.textContent = ' ' + t.showExplanationCheckbox;
  }

  // Modal titles
  document.querySelector('#opacity-modal .modal-content h4').innerText = t.opacityTitle;
  const historyTitleEl = document.querySelector('#history-modal .modal-content h4');
  if (historyTitleEl) historyTitleEl.innerText = t.historyTitle;
  const clearHistoryBtnEl = document.getElementById('clear-history-btn');
  if (clearHistoryBtnEl) clearHistoryBtnEl.innerText = t.clearHistoryBtn; 

  // Placeholders
  for (let i = 1; i <= 4; i++) {
    const whole = document.getElementById('whole' + i);
    const num = document.getElementById('num' + i);
    const den = document.getElementById('den' + i);
    if (whole) whole.placeholder = t.conv_whole;
    if (num) num.placeholder = t.conv_num;
    if (den) den.placeholder = t.conv_den;
  }
  document.getElementById('conv_whole').placeholder = t.conv_whole;
  document.getElementById('conv_num').placeholder = t.conv_num;
  document.getElementById('conv_den').placeholder = t.conv_den;
  document.getElementById('dec_num').placeholder = t.dec_num;
  document.getElementById('dec_den').placeholder = t.dec_den;
  document.getElementById('dec_input_fraction').placeholder = t.dec_input_fraction;
  
  const simpNum = document.getElementById('simp_num');
  const simpDen = document.getElementById('simp_den');
  if (simpNum) simpNum.placeholder = t.simp_num;
  if (simpDen) simpDen.placeholder = t.simp_den;
  const btnSimp = document.getElementById('btn-simplify');
  if (btnSimp) btnSimp.innerText = t.btnSimplify;
  const simpResult = document.getElementById('simplify-result');
  if (simpResult) simpResult.innerText = "";
}

// --- Math utility functions ---
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
    return (Math.abs(a * b)) / gcd(a, b);
}

// --- UI functions ---
function switchMode(mode) {
    panels.forEach(panel => {
        panel.classList.remove('show');
    });
    document.getElementById(mode + '-section').classList.add('show');
    applyLocale(); // Ensure UI is localized after mode switch
}

function updateFractionInputs() {
    const count = parseInt(fractionCountSelect.value);
    for (let i = 1; i <= 4; i++) {
        const fracEl = document.getElementById('fraction' + i);
        if (fracEl) {
            if (i > count) {
                fracEl.setAttribute('hidden', '');
            } else {
                fracEl.removeAttribute('hidden');
            }
        }
    }
}

// --- Main fraction operation logic ---
function calculate() {
    latestExplanation = ''; // <-- FIX #2: Clear any old explanation at the start
    
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang];
    const count = parseInt(fractionCountSelect.value);
    const operator = document.getElementById('operator').value;
    let explanation = '';
    let originalInputs = [];
    let nums = [], dens = [];

    // 1. Get and validate inputs, convert mixed to improper
    explanation += t.expStep1 + '\n';
    for (let i = 1; i <= count; i++) {
        const whole = parseInt(document.getElementById('whole' + i).value) || 0;
        const num = parseInt(document.getElementById('num' + i).value) || 0;
        const den = parseInt(document.getElementById('den' + i).value);

        originalInputs.push(`${whole ? whole + ' ' : ''}${num}/${den}`);

        if (isNaN(den) || den === 0) {
            document.getElementById("result").innerText = t.invalidDen;
            explanationBox.style.display = 'none';
            return;
        }

        const impNum = Math.abs(whole) * den + num;
        nums.push(whole < 0 ? -impNum : impNum);
        dens.push(den);
        
        if (whole !== 0) {
            explanation += t.expMixedToImproper
                .replace('{i}', i)
                .replace(/{whole}/g, whole)
                .replace('{num}', num)
                .replace(/{den}/g, den)
                .replace('{impNum}', nums[i-1]) + '\n';
        } else {
            explanation += t.expIsProper
                .replace('{i}', i)
                .replace('{num}', num)
                .replace('{den}', den) + '\n';
        }
    }
    explanation += '------------------------------------------------\n';

    // 2. Perform calculations step-by-step
    let resultNum = nums[0];
    let resultDen = dens[0];
    
    explanation += t.expStep2.replace('{expression}', originalInputs.join(` ${operator} `)) + '\n';

    for (let i = 1; i < count; i++) {
        let currentExplanation = t.expCalcStep
            .replace('{i}', i)
            .replace('{num1}', resultNum)
            .replace('{den1}', resultDen)
            .replace('{op}', operator)
            .replace('{num2}', nums[i])
            .replace('{den2}', dens[i]) + '\n';
        
        switch (operator) {
            case "+":
            case "-":
                let commonDen = lcm(resultDen, dens[i]);
                let newNum1 = resultNum * (commonDen / resultDen);
                let newNum2 = nums[i] * (commonDen / dens[i]);
                currentExplanation += t.expFindLCM
                    .replace('{den1}', resultDen)
                    .replace('{den2}', dens[i])
                    .replace('{lcm}', commonDen) + '\n';
                currentExplanation += t.expAdjustFractions
                    .replace('{num1}', resultNum)
                    .replace('{den1}', resultDen)
                    .replace('{newNum1}', newNum1)
                    .replace('{num2}', nums[i])
                    .replace('{den2}', dens[i])
                    .replace('{newNum2}', newNum2)
                    .replace(/{lcm}/g, commonDen) + '\n';
                currentExplanation += t.expPerformOp
                    .replace('{newNum1}', newNum1)
                    .replace('{op}', operator)
                    .replace('{newNum2}', newNum2)
                    .replace('{lcm}', commonDen) + '\n';
                resultNum = (operator === "+") ? newNum1 + newNum2 : newN1 - newNum2;
                resultDen = commonDen;
                break;
            case "*":
                currentExplanation += t.expMultiplyNumerators
                    .replace('{num1}', resultNum)
                    .replace('{num2}', nums[i])
                    .replace('{resNum}', resultNum * nums[i]) + '\n';
                currentExplanation += t.expMultiplyDenominators
                    .replace('{den1}', resultDen)
                    .replace('{den2}', dens[i])
                    .replace('{resDen}', resultDen * dens[i]) + '\n';
                resultNum *= nums[i];
                resultDen *= dens[i];
                break;
            case "/":
                if (nums[i] === 0) {
                    document.getElementById("result").innerText = t.cannotDivide;
                    explanationBox.style.display = 'none';
                    return;
                }
                currentExplanation += t.expInvertAndMultiply
                    .replace('{num1}', resultNum)
                    .replace('{den1}', resultDen)
                    .replace('{num2}', nums[i])
                    .replace('{den2}', dens[i]) + '\n';
                currentExplanation += t.expMultiplyNumerators
                    .replace('{num1}', resultNum)
                    .replace('{num2}', dens[i])
                    .replace('{resNum}', resultNum * dens[i]) + '\n';
                currentExplanation += t.expMultiplyDenominators
                    .replace('{den1}', resultDen)
                    .replace('{num2}', nums[i])
                    .replace('{resDen}', resultDen * nums[i]) + '\n';
                resultNum *= dens[i];
                resultDen *= nums[i];
                break;
        }
        currentExplanation += t.expIntermediateResult
            .replace('{num}', resultNum)
            .replace('{den}', resultDen) + '\n';
        explanation += currentExplanation;
    }
    explanation += '------------------------------------------------\n';

    // 3. Simplify the final result
    explanation += t.expStep3
        .replace('{num}', resultNum)
        .replace('{den}', resultDen) + '\n';
    
    const simplifyGCD = gcd(Math.abs(resultNum), Math.abs(resultDen));
    
    if (simplifyGCD > 1) {
        explanation += t.expFindGCD
            .replace('{num}', Math.abs(resultNum))
            .replace('{den}', Math.abs(resultDen))
            .replace('{gcd}', simplifyGCD) + '\n';
        explanation += t.expDivideByGCD + '\n';
        explanation += t.expDivideNumerator
            .replace('{num}', resultNum)
            .replace('{gcd}', simplifyGCD)
            .replace('{resNum}', resultNum / simplifyGCD) + '\n';
        explanation += t.expDivideDenominator
            .replace('{den}', resultDen)
            .replace('{gcd}', simplifyGCD)
            .replace('{resDen}', resultDen / simplifyGCD) + '\n';
        resultNum /= simplifyGCD;
        resultDen /= simplifyGCD;
    } else {
        explanation += t.expSimplestForm + '\n';
    }

    let resultStr = (resultDen === 1) ? `${resultNum}` : `${resultNum}/${resultDen}`;
    document.getElementById("result").innerText = `${t.result} ${resultStr}`;
    // Save to history (mode: Operate)
    // saveToHistory({
    //   mode: 'Operate',
    //   input: originalInputs.join(` ${operator} `),
    //   result: resultStr,
    //   time: new Date().toLocaleString()
    // });
    // 4. Display or hide the explanation box
    latestExplanation = explanation; // Save the latest explanation
    updateExplanationBox();
}

// --- Explanation Box Logic ---
function updateExplanationBox() {
    if (showExplanationCheckbox.checked && latestExplanation) {
        explanationBox.innerText = latestExplanation;
        explanationBox.style.display = 'block';
    } else {
        explanationBox.style.display = 'none';
    }
}

// --- Conversion logic ---
function convertMixed() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang];
    const whole = parseInt(document.getElementById("conv_whole").value) || 0;
    const num = parseInt(document.getElementById("conv_num").value) || 0;
    const den = parseInt(document.getElementById("conv_den").value);
    if (isNaN(den) || den === 0) {
        document.getElementById("convert-result").innerText = t.invalidDen;
        return;
    }
    const improper = Math.abs(whole) * den + num;
    const resultNum = whole < 0 ? -improper : improper;
    const resultStr = `${t.improper} ${resultNum}/${den}`;
    document.getElementById("convert-result").innerText = resultStr;
    // saveToHistory({
    //   mode: 'Convert',
    //   input: `${whole ? whole + ' ' : ''}${num}/${den}`,
    //   result: `${resultNum}/${den}`,
    //   time: new Date().toLocaleString()
    // });
}

function convertDecimal() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang];
    const num = parseInt(document.getElementById("dec_num").value);
    const den = parseInt(document.getElementById("dec_den").value);
    if (isNaN(num) || isNaN(den) || den === 0) {
        document.getElementById("decimal-result").innerText = t.invalidInput;
        return;
    }
    const resultStr = `${num/den}`;
    document.getElementById("decimal-result").innerText = `${t.decimalResult} ${resultStr}`;
    // saveToHistory({
    //   mode: 'Fraction → Decimal',
    //   input: `${num}/${den}`,
    //   result: resultStr,
    //   time: new Date().toLocaleString()
    // });
}

function convertDecimalToFraction() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang];
    const decimalInput = parseFloat(document.getElementById("dec_input_fraction").value);
    if (isNaN(decimalInput)) {
        document.getElementById("decimal-to-fraction-result").innerText = t.invalidDecimal;
        return;
    }
    let tolerance = 1.0E-6;
    let h1 = 1, h2 = 0;
    let k1 = 0, k2 = 1;
    let b = decimalInput;
    do {
        let a = Math.floor(b);
        let aux = h1;
        h1 = a * h1 + h2;
        h2 = aux;
        aux = k1;
        k1 = a * k1 + k2;
        k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(decimalInput - h1 / k1) > decimalInput * tolerance && k1 < 10000);
    const resultStr = `${h1}/${k1}`;
    document.getElementById("decimal-to-fraction-result").innerText = `${t.decFracResult} ${resultStr}`;
    // saveToHistory({
    //   mode: 'Decimal → Fraction',
    //   input: decimalInput,
    //   result: resultStr,
    //   time: new Date().toLocaleString()
    // });
}

// --- Simplify Logic ---
function simplifyFraction() {
  const lang = localStorage.getItem('locale') || 'en';
  const t = locales[lang];
  const num = parseInt(document.getElementById("simp_num").value);
  const den = parseInt(document.getElementById("simp_den").value);
  const resultDiv = document.getElementById("simplify-result");
  if (isNaN(num) || isNaN(den) || den === 0) {
    resultDiv.innerText = t.invalidSimp || t.invalidInput || "Invalid input!";
    return;
  }
  const divisor = gcd(Math.abs(num), Math.abs(den));
  const simpNum = num / divisor;
  const simpDen = den / divisor;
  let resultStr = simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}`;
  resultDiv.innerText = `${t.simplifyResult || "Simplified:"} ${resultStr}`;
  // saveToHistory({
  //   mode: t.simplify || "Simplify",
  //   input: `${num}/${den}`,
  //   result: resultStr,
  //   time: new Date().toLocaleString()
  // });
}
// NOTE: I have commented out saveToHistory() as the function definition was not provided. 
// If you have that function, you can uncomment these lines.

// --- Settings logic (Theme & Wallpaper) ---
function applySettings() {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }

    const savedBG = localStorage.getItem('customBackground');
    if (savedBG) {
        document.body.style.backgroundImage = `url('${savedBG}')`;
        document.body.classList.add('has-custom-bg');
    } else {
        document.body.style.backgroundImage = '';
        document.body.classList.remove('has-custom-bg');
    }
}

function toggleTheme() {
    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    if (isDarkMode) {
        localStorage.setItem('themeMode', 'light');
    } else {
        localStorage.setItem('themeMode', 'dark');
    }
    applySettings();
}

// --- Color Manipulation Helper ---
// pSBC function for color manipulation
const pSBC = (p, c0, c1, l) => {
    let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof (c1) == "string";
    if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
    let pSBCr = (d) => {
        let n = d.length, x = {};
        if (n > 9) {
            [r, g, b, a] = d = d.split(","), n = d.length;
            if (n < 3 || n > 4) return null;
            x.r = i(r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
        } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
            else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
        } return x
    };
    h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }, p = P ? p * -1 : p, P = 1 - p;
    if (!f || !t) return null;
    if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
    else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
    a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
    if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
    else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
}


// --- SINGLE INITIALIZATION BLOCK ---
// This runs only after the entire HTML page is loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- Helper functions that need the DOM ---
    function applyAccentColor(color) {
      document.documentElement.style.setProperty('--btn-primary', color);
      const hoverColor = pSBC(-0.2, color);
      if(hoverColor) {
        document.documentElement.style.setProperty('--btn-hover', hoverColor);
      }
    }
    
    function applyOpacity(value) {
      document.documentElement.style.setProperty('--surface-opacity', value);
    }

    // --- Main Event Listeners ---
    modeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchMode(e.target.dataset.mode);
        });
    });
    
    fractionCountSelect.addEventListener('change', updateFractionInputs);
    document.getElementById('calc-btn').addEventListener('click', calculate);
    document.getElementById('btn-convert-mixed').addEventListener('click', convertMixed);
    document.getElementById('btn-frac-to-dec').addEventListener('click', convertDecimal);
    document.getElementById('btn-dec-to-frac').addEventListener('click', convertDecimalToFraction);
    document.getElementById('btn-simplify').addEventListener('click', simplifyFraction);

    // Explanation checkbox
    showExplanationCheckbox.addEventListener('change', updateExplanationBox);

    // --- Options Menu Listeners ---
    toggleThemeBtn.addEventListener('click', toggleTheme);
    
    uploadBgBtn.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            const dataURL = evt.target.result;
            localStorage.setItem('customBackground', dataURL);
            applySettings();
        };
        reader.readAsDataURL(file);
    });
    
    resetBgBtn.addEventListener('click', () => {
        localStorage.removeItem('customBackground');
        applySettings();
    });

    // Language
    document.getElementById('toggle-lang-btn').addEventListener('click', () => {
      const current = localStorage.getItem('locale') || 'en';
      localStorage.setItem('locale', current === 'en' ? 'id' : 'en');
      applyLocale();
    });

    // Accent Color
    changeAccentBtn.addEventListener('click', () => accentColorPicker.click());
    
    accentColorPicker.addEventListener('input', (e) => {
      const newColor = e.target.value;
      applyAccentColor(newColor);
      localStorage.setItem('accentColor', newColor);
    });

    // Opacity Modal
    openOpacityModalBtn.addEventListener('click', () => {
        opacityModal.style.display = 'flex';
        const savedOpacity = localStorage.getItem('containerOpacity') || '0.85';
        opacitySlider.value = savedOpacity;
    });
    
    opacityCloseBtn.addEventListener('click', () => {
        opacityModal.style.display = 'none';
    });
    
    opacitySlider.addEventListener('input', (e) => {
      const newOpacity = e.target.value;
      applyOpacity(newOpacity);
      localStorage.setItem('containerOpacity', newOpacity);
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === opacityModal) {
            opacityModal.style.display = 'none';
        }
    });

    // --- Help Menu Listeners (from inline script) ---
    document.getElementById('about-btn').addEventListener('click', () => {
        const lang = localStorage.getItem('locale') || 'en';
        alert(locales[lang].aboutMsg);
    });

    document.getElementById('docs-btn').addEventListener('click', () => {
        const url = 'https://ashyraffa32.github.io/FractionCalcSite/getstarted.html';
        // Electron
        if (window.require) {
          const { shell } = require('electron');
          shell.openExternal(url);
        } else {
          // Browser fallback
          window.open(url, '_blank');
        }
    });

    // --- View Menu Listeners (from inline script) ---
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });
    

    // --- Initial Load ---
    // 1. Apply saved theme, background, accent, and opacity
    let savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
        savedTheme = 'light';
        localStorage.setItem('theme', 'light');
    }
    if (savedTheme === 'dark') {
        document.documentElement.classList.remove('light');
    } else {
        document.documentElement.classList.add('light');
    }
    
    applySettings(); // Applies theme & background
    
    const savedAccentColor = localStorage.getItem('accentColor');
    if (savedAccentColor) {
      applyAccentColor(savedAccentColor);
      accentColorPicker.value = savedAccentColor;
    }
    
    const savedOpacity = localStorage.getItem('containerOpacity');
    if (savedOpacity) {
      applyOpacity(savedOpacity);
      opacitySlider.value = savedOpacity;
    }

    // 2. Set up the UI
    updateFractionInputs();
    
    // 3. Apply language
    applyLocale();
});