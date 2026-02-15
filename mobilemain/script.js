// Variable and DOM elements
const tabsContainer = document.querySelector('.tabs');
const panels = document.querySelectorAll('.panel');
const fractionCountSelect = document.getElementById('fraction-count');
const showExplanationCheckbox = document.getElementById('show-explanation-checkbox');
const explanationContainer = document.getElementById('explanation-container');
const explanationBox = document.getElementById('explanation-box');
const toggleConvertMode = document.getElementById('toggle-convert-mode');

// --- Math utility functions ---
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
    return (Math.abs(a * b)) / gcd(a, b);
}

// --- UI functions ---
function switchMode(mode) {
    if (!mode) return;
    panels.forEach(panel => {
        panel.hidden = true;
        panel.classList.remove('show');
    });
    const panelToShow = document.getElementById(mode + '-section');
    if(panelToShow) {
      panelToShow.hidden = false;
      panelToShow.classList.add('show');
    }
}

function updateFractionInputs() {
    const count = parseInt(fractionCountSelect.value);
    for (let i = 1; i <= 4; i++) {
        const fracEl = document.getElementById('fraction' + i);
        if (fracEl) {
            fracEl.hidden = (i > count);
        }
    }
}

// --- Theme, Accent, Opacity, and Background handling from settings.js ---
function applyAllSettings() {
    const savedTheme = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');

    const savedAccent = localStorage.getItem('accentColor');
    if (savedAccent) {
        document.documentElement.style.setProperty('--accent', savedAccent);
        const accent2 = pSBC(-0.2, savedAccent);
        if (accent2) document.documentElement.style.setProperty('--accent-2', accent2);
    }

    const savedOpacity = localStorage.getItem('opacity');
    if (savedOpacity) {
        document.documentElement.style.setProperty('--surface-opacity', savedOpacity);
    }
    
    const savedBG = localStorage.getItem('customBackground');
    if (savedBG) {
        document.body.style.backgroundImage = `url('${savedBG}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    } else {
        document.body.style.backgroundImage = '';
    }
}

// --- Localization strings ---
const locales = {
  en: {
    operate: "Operation",
    convert: "Convert",
    decimal: "To Decimal",
    fraction: "To Fraction",
    simplify: "Simplify",
    howMany: "How many?",
    operatorLabel: "Operator",
    whole: "Whole",
    numerator: "Numerator",
    denominator: "Denominator",
    calculate: "Calculate",
    result: "Result:",
    hint: "Leave 'Whole' empty or 0 for proper fractions.",
    toDecimal: "To Decimal",
    convertBtn: "Convert to Improper",
    convertToMixed: "Convert to Mixed",
    convertToggleLabel: "Convert Improper ↔ Mixed",
    enterDecimal: "Insert Decimal...",
    toFraction: "Convert to Fractions",
    simplifyBtn: "Simplify",
    invalidDen: "Denominator must not be empty or zero.",
    cannotDivide: "Cannot divide by zero!",
    invalidInput: "Invalid input!",
    improperResult: "Improper Fraction:",
    decimalResult: "Decimal:",
    simplifyResult: "Simplified Fraction:",
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
    operate: "Operasi",
    convert: "Konversi",
    decimal: "Ke Desimal",
    fraction: "Ke Pecahan",
    simplify: "Sederhanakan",
    howMany: "Berapa banyak?",
    operatorLabel: "Operator",
    whole: "Bulat",
    numerator: "Pembilang",
    denominator: "Penyebut",
    calculate: "Hitung",
    result: "Hasil:",
    hint: "Biarkan 'Bulat' kosong atau 0 untuk pecahan biasa.",
    toDecimal: "Ke Desimal",
    convertBtn: "Konversi ke Biasa",
    convertToMixed: "Konversi ke Campuran",
    convertToggleLabel: "Konversi Biasa ↔ Campuran",
    enterDecimal: "Masukkan Desimal...",
    toFraction: "Konversi ke Pecahan",
    simplifyBtn: "Sederhanakan",
    invalidDen: "Penyebut tidak boleh kosong atau nol.",
    cannotDivide: "Tidak bisa dibagi dengan nol!",
    invalidInput: "Input tidak valid!",
    improperResult: "Pecahan Biasa:",
    decimalResult: "Desimal:",
    simplifyResult: "Pecahan Sederhana:",
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
  },
  de: {
    operate: "Betrieb",
    convert: "Umwandeln",
    decimal: "Zu Dezimal",
    fraction: "Zu Bruch",
    simplify: "Vereinfachen",
    howMany: "Wie viele?",
    operatorLabel: "Operator",
    whole: "Ganz",
    numerator: "Zähler",
    denominator: "Nenner",
    calculate: "Berechnen",
    result: "Ergebnis:",
    hint: "Lassen Sie 'Ganz' leer oder 0 für echte Brüche.",
    toDecimal: "Zu Dezimal",
    convertBtn: "In unechten Bruch konvertieren",
    convertToMixed: "In gemischten Bruch konvertieren",
    convertToggleLabel: "Unechten Bruch ↔ Gemischten Konvertieren",
    enterDecimal: "Dezimalzahl eingeben...",
    toFraction: "In Bruch konvertieren",
    simplifyBtn: "Vereinfachen",
    invalidDen: "Der Nenner darf nicht leer oder null sein.",
    cannotDivide: "Kann nicht durch Null teilen!",
    invalidInput: "Ungültige Eingabe!",
    improperResult: "Unechter Bruch:",
    decimalResult: "Dezimal:",
    simplifyResult: "Vereinfachter Bruch:",
    // Explanation Strings
    expStep1: "Schritt 1: Konvertieren Sie alle gemischten Zahlen in unechte Brüche.",
    expMixedToImproper: "  - B{i}: {whole} {num}/{den} = ({whole} * {den} + {num})/{den} = {impNum}/{den}",
    expIsProper: "  - B{i}: {num}/{den} ist bereits ein echter Bruch.",
    expStep2: "Schritt 2: Führen Sie die Operation durch: {expression}",
    expCalcStep: "\nBerechnung {i}: ({num1}/{den1}) {op} ({num2}/{den2})",
    expFindLCM: "  - Finden Sie einen gemeinsamen Nenner (KGV von {den1} und {den2}): {lcm}",
    expAdjustFractions: "  - Passen Sie Brüche an: ({num1}/{den1}) = ({newNum1}/{lcm}), ({num2}/{den2}) = ({newNum2}/{lcm})",
    expPerformOp: "  - Operation durchführen: ({newNum1} {op} {newNum2}) / {lcm}",
    expMultiplyNumerators: "  - Zähler multiplizieren: {num1} * {num2} = {resNum}",
    expMultiplyDenominators: "  - Nenner multiplizieren: {den1} * {den2} = {resDen}",
    expInvertAndMultiply: "  - Invertieren Sie den zweiten Bruch und multiplizieren: ({num1}/{den1}) * ({den2}/{num2})",
    expIntermediateResult: "  - Zwischenergebnis: {num}/{den}",
    expStep3: "Schritt 3: Vereinfachen Sie den endgültigen Bruch: {num}/{den}",
    expFindGCD: "  - Finden Sie den größten gemeinsamen Teiler (GGT) von {num} und {den}: {gcd}",
    expDivideByGCD: "  - Dividieren Sie Zähler und Nenner durch den GGT:",
    expDivideNumerator: "  - {num} / {gcd} = {resNum}",
    expDivideDenominator: "  - {den} / {gcd} = {resDen}",
    expSimplestForm: "  - Der Bruch ist bereits in seiner einfachsten Form."
  },
  jp: {
    operate: "演算",
    convert: "変換",
    decimal: "小数へ",
    fraction: "分数へ",
    simplify: "簡約",
    howMany: "いくつ？",
    operatorLabel: "演算子",
    whole: "整数部",
    numerator: "分子",
    denominator: "分母",
    calculate: "計算",
    result: "結果：",
    hint: "真の分数の場合は「整数部」を空白のままにするか0にしてください。",
    toDecimal: "小数へ",
    convertBtn: "仮分数に変換",
    convertToMixed: "帯分数に変換",
    convertToggleLabel: "仮分数 ↔ 帯分数に変換",
    enterDecimal: "小数を入力...",
    toFraction: "分数に変換",
    simplifyBtn: "簡約",
    invalidDen: "分母は空白または0であってはいけません。",
    cannotDivide: "ゼロで除算することはできません！",
    invalidInput: "無効な入力です！",
    improperResult: "仮分数：",
    decimalResult: "小数：",
    simplifyResult: "簡約分数：",
    // Explanation Strings
    expStep1: "ステップ1：すべての帯分数を仮分数に変換します。",
    expMixedToImproper: "  - 分{i}：{whole} {num}/{den} = ({whole} * {den} + {num})/{den} = {impNum}/{den}",
    expIsProper: "  - 分{i}：{num}/{den}は既に真の分数です。",
    expStep2: "ステップ2：演算を実行します：{expression}",
    expCalcStep: "\n計算 {i}：({num1}/{den1}) {op} ({num2}/{den2})",
    expFindLCM: "  - 共通分母を見つけます（{den1}と{den2}の最小公倍数）：{lcm}",
    expAdjustFractions: "  - 分数を調整：({num1}/{den1}) = ({newNum1}/{lcm})、({num2}/{den2}) = ({newNum2}/{lcm})",
    expPerformOp: "  - 演算を実行：({newNum1} {op} {newNum2}) / {lcm}",
    expMultiplyNumerators: "  - 分子を乗算：{num1} * {num2} = {resNum}",
    expMultiplyDenominators: "  - 分母を乗算：{den1} * {den2} = {resDen}",
    expInvertAndMultiply: "  - 2番目の分数を反転して乗算：({num1}/{den1}) * ({den2}/{num2})",
    expIntermediateResult: "  - 中間結果：{num}/{den}",
    expStep3: "ステップ3：最終分数を簡約：{num}/{den}",
    expFindGCD: "  - {num}と{den}の最大公約数（GCD）を見つけます：{gcd}",
    expDivideByGCD: "  - 分子と分母をGCDで割ります：",
    expDivideNumerator: "  - {num} / {gcd} = {resNum}",
    expDivideDenominator: "  - {den} / {gcd} = {resDen}",
    expSimplestForm: "  - 分数は既に最も簡潔な形式です。"
  }
};

// --- Apply localization to UI ---
function applyLocale() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang];
    if (!t) return;

    // A helper to set text or placeholder
    const setText = (selector, text, isPlaceholder = false) => {
        const el = document.querySelector(selector);
        if (el) {
            if (isPlaceholder) el.placeholder = text;
            else el.innerText = text;
        }
    };
    
    // Set texts and placeholders
    setText('[data-mode="operate"]', t.operate);
    setText('[data-mode="convert"]', t.convert);
    setText('[data-mode="decimal"]', t.decimal);
    setText('[data-mode="fraction"]', t.fraction);
    setText('[data-mode="simplify"]', t.simplify);
    setText('label[for="fraction-count"]', t.howMany);
    setText('label[for="operator"]', t.operatorLabel);
    setText('#calc-btn', t.calculate);
    setText('#result', t.result);
    setText('.hint', t.hint);
    setText('#btn-convert-mixed', t.convertBtn);
    setText('#btn-frac-to-dec', t.toDecimal);
    setText('#btn-dec-to-frac', t.toFraction);
    setText('#btn-simplify', t.simplifyBtn);
    
    for (let i = 1; i <= 4; i++) {
        setText(`#whole${i}`, t.whole, true);
        setText(`#num${i}`, t.numerator, true);
        setText(`#den${i}`, t.denominator, true);
    }
    setText(`#conv_whole`, t.whole, true);
    setText(`#conv_num`, t.numerator, true);
    setText(`#conv_den`, t.denominator, true);
    setText(`#dec_num`, t.numerator, true);
    setText(`#dec_den`, t.denominator, true);
    setText(`#dec_input_fraction`, t.enterDecimal, true);
    
    // Handle generic data-i18n attributes for any element
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = t[key];
        if (text) {
            el.innerText = text;
        }
    });
}


// --- Main fraction operation logic ---
function calculate() {
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
            explanationContainer.hidden = true;
            return;
        }

        const impNum = Math.abs(whole) * den + num;
        nums.push(whole < 0 ? -impNum : impNum);
        dens.push(den);
        
        if (whole !== 0) {
            explanation += t.expMixedToImproper
                .replace('{i}', i).replace(/{whole}/g, whole).replace('{num}', num)
                .replace(/{den}/g, den).replace('{impNum}', nums[i-1]) + '\n';
        } else {
            explanation += t.expIsProper
                .replace('{i}', i).replace('{num}', num).replace('{den}', den) + '\n';
        }
    }
    explanation += '--------------------------------------\n';

    // 2. Perform calculations step-by-step
    let resultNum = nums[0];
    let resultDen = dens[0];
    
    explanation += t.expStep2.replace('{expression}', originalInputs.join(` ${operator} `)) + '\n';

    for (let i = 1; i < count; i++) {
        let currentExplanation = t.expCalcStep
            .replace('{i}', i).replace('{num1}', resultNum).replace('{den1}', resultDen)
            .replace('{op}', operator).replace('{num2}', nums[i]).replace('{den2}', dens[i]) + '\n';
        
        switch (operator) {
            case "+": case "-":
                let commonDen = lcm(resultDen, dens[i]);
                let newNum1 = resultNum * (commonDen / resultDen);
                let newNum2 = nums[i] * (commonDen / dens[i]);
                currentExplanation += t.expFindLCM.replace('{den1}', resultDen).replace('{den2}', dens[i]).replace('{lcm}', commonDen) + '\n';
                currentExplanation += t.expAdjustFractions.replace('{num1}', resultNum).replace('{den1}', resultDen).replace('{newNum1}', newNum1).replace('{num2}', nums[i]).replace('{den2}', dens[i]).replace('{newNum2}', newNum2).replace(/{lcm}/g, commonDen) + '\n';
                currentExplanation += t.expPerformOp.replace('{newNum1}', newNum1).replace('{op}', operator).replace('{newNum2}', newNum2).replace('{lcm}', commonDen) + '\n';
                resultNum = (operator === "+") ? newNum1 + newNum2 : newNum1 - newNum2;
                resultDen = commonDen;
                break;
            case "*":
                currentExplanation += t.expMultiplyNumerators.replace('{num1}', resultNum).replace('{num2}', nums[i]).replace('{resNum}', resultNum * nums[i]) + '\n';
                currentExplanation += t.expMultiplyDenominators.replace('{den1}', resultDen).replace('{den2}', dens[i]).replace('{resDen}', resultDen * dens[i]) + '\n';
                resultNum *= nums[i];
                resultDen *= dens[i];
                break;
            case "/":
                if (nums[i] === 0) {
                    document.getElementById("result").innerText = t.cannotDivide;
                    explanationContainer.hidden = true;
                    return;
                }
                currentExplanation += t.expInvertAndMultiply.replace('{num1}', resultNum).replace('{den1}', resultDen).replace('{num2}', nums[i]).replace('{den2}', dens[i]) + '\n';
                resultNum *= dens[i];
                resultDen *= nums[i];
                break;
        }
        currentExplanation += t.expIntermediateResult.replace('{num}', resultNum).replace('{den}', resultDen) + '\n';
        explanation += currentExplanation;
    }
    explanation += '--------------------------------------\n';

    // 3. Simplify the final result
    explanation += t.expStep3.replace('{num}', resultNum).replace('{den}', resultDen) + '\n';
    
    const simplifyGCD = gcd(Math.abs(resultNum), Math.abs(resultDen));
    
    if (simplifyGCD > 1) {
        explanation += t.expFindGCD.replace('{num}', Math.abs(resultNum)).replace('{den}', Math.abs(resultDen)).replace('{gcd}', simplifyGCD) + '\n';
        explanation += t.expDivideByGCD + '\n';
        explanation += t.expDivideNumerator.replace('{num}', resultNum).replace('{gcd}', simplifyGCD).replace('{resNum}', resultNum / simplifyGCD) + '\n';
        explanation += t.expDivideDenominator.replace('{den}', resultDen).replace('{gcd}', simplifyGCD).replace('{resDen}', resultDen / simplifyGCD) + '\n';
        resultNum /= simplifyGCD;
        resultDen /= simplifyGCD;
    } else {
        explanation += t.expSimplestForm + '\n';
    }

    let resultStr = (resultDen === 1) ? `${resultNum}` : `${resultNum}/${resultDen}`;
    document.getElementById("result").innerText = `${t.result} ${resultStr}`;
    
    // 4. Display or hide the explanation box
    if (showExplanationCheckbox.checked) {
        explanationBox.textContent = explanation;
        explanationContainer.hidden = false;
    } else {
        explanationContainer.hidden = true;
    }
}

// Simplification logic
function simplifyFraction() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang];
    const num = parseInt(document.getElementById("simp_num").value);
    const den = parseInt(document.getElementById("simp_den").value);
    const resultEl = document.getElementById("simplify-result");

    if (isNaN(num) || isNaN(den)) {
        resultEl.innerText = t.invalidInput;
        return;
    }
    if (den === 0) {
        resultEl.innerText = t.invalidDen;
        return;
    }

    const divisor = gcd(Math.abs(num), Math.abs(den));
    const simpNum = num / divisor;
    const simpDen = den / divisor;

    // Handle cases like 4/2 = 2
    let resultStr = (simpDen === 1) ? `${simpNum}` : `${simpNum}/${simpDen}`;
    resultEl.innerText = `${t.simplifyResult} ${resultStr}`;
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

    if (toggleConvertMode.checked) {
        // Convert improper to mixed
        const mixedWhole = Math.floor(num / den);
        const mixedNum = Math.abs(num % den);
        const resultStr = `${mixedWhole ? mixedWhole + ' ' : ''}${mixedNum}/${den}`;
        document.getElementById("convert-result").innerText = `${t.result} ${resultStr}`;
    } else {
        // Convert mixed to improper
        const improper = Math.abs(whole) * den + num;
        const resultNum = whole < 0 ? -improper : improper;
        const resultStr = `${resultNum}/${den}`;
        document.getElementById("convert-result").innerText = `${t.result} ${resultStr}`;
    }
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
    document.getElementById("decimal-result").innerText = `${t.decimalResult} ${num / den}`;
}

function convertDecimalToFraction() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang];
    const decimalInput = parseFloat(document.getElementById("dec_input_fraction").value);
    if (isNaN(decimalInput)) {
        document.getElementById("decimal-to-fraction-result").innerText = t.invalidInput;
        return;
    }
    let tolerance = 1.0E-6;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimalInput;
    do {
        let a = Math.floor(b);
        let aux = h1; h1 = a * h1 + h2; h2 = aux;
        aux = k1; k1 = a * k1 + k2; k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(decimalInput - h1 / k1) > decimalInput * tolerance && k1 < 10000);
    document.getElementById("decimal-to-fraction-result").innerText = `${t.result} ${h1}/${k1}`;

        // Easter egg: 143?
        if (decimalInput === 0.143 || decimalInput === 143 || decimalInput === 1.43 || decimalInput === 14.3) {
            alert("All it costs is your love!\n~ Mari");
        } else if (decimalInput === 3.1) { // Mari's Birthday
                  alert("Our Dearest Mari\nThe sun shined brighter when she was here...");
              } else if (decimalInput === 2.18) { // Basil's Birthday
                  alert("Everything is going to be okay....\n~ Basil");
              } else if (decimalInput === 5.23) { // Aubrey's Birthday
                 alert("My old friends wasn't there when i needed them.\n~ Aubrey");
              } else if (decimalInput === 7.20) { // Sunny's Birthday
                 alert("I have to tell you something...");
              } else if (decimalInput == 1.1) { // Hero's Birthday
                  alert("Hey, Sunny... Can I poke your brain for a minute?\nI really love cooking and all and Mari always says I'm really good, but my parents want me to become a doctor...\nDo you think I should become a chef?\n~ Hero");
              } else if (decimalInput == 11.11) { // Kel's Birthday
                  alert("Do you remember me? It's your old friend, KEL!");
              }
}

// --- Event Listeners ---
if (tabsContainer) {
    tabsContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const activeTab = document.querySelector('.tab.active');
            if (activeTab) activeTab.classList.remove('active');
            e.target.classList.add('active');
            switchMode(e.target.dataset.mode);
        }
    });
}
if (fractionCountSelect) fractionCountSelect.addEventListener('change', updateFractionInputs);
if (showExplanationCheckbox) {
    showExplanationCheckbox.addEventListener('change', () => {
        if (!showExplanationCheckbox.checked) {
            explanationContainer.hidden = true;
        }
    });
}

// Update button text and placeholders based on toggle state
toggleConvertMode.addEventListener('change', () => {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang];
    const isImproperToMixed = toggleConvertMode.checked;
    document.getElementById('btn-convert-mixed').innerText = isImproperToMixed ? t.convertToMixed : t.convertBtn;
    document.getElementById('conv_whole').placeholder = isImproperToMixed ? 'Improper Whole' : 'Whole';
    document.getElementById('conv_num').placeholder = isImproperToMixed ? 'Improper Numerator' : 'Numerator';
    document.getElementById('conv_den').placeholder = isImproperToMixed ? 'Improper Denominator' : 'Denominator';
});

document.getElementById('calc-btn')?.addEventListener('click', calculate);
document.getElementById('btn-convert-mixed')?.addEventListener('click', convertMixed);
document.getElementById('btn-frac-to-dec')?.addEventListener('click', convertDecimal);
document.getElementById('btn-dec-to-frac')?.addEventListener('click', convertDecimalToFraction);
document.getElementById('btn-simplify')?.addEventListener('click', simplifyFraction); // new simplify button

// --- Initial load ---
document.addEventListener('DOMContentLoaded', () => {
    applyAllSettings();
    updateFractionInputs();
    applyLocale();
});

// pSBC Function to darken/lighten colors (for hover states)
const pSBC=(p,c0,c1,l)=>{let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;let pSBCr=(d)=>{let n=d.length,x={};if(n>9){[r,g,b,a]=d=d.split(","),n=d.length;if(n<3||n>4)return null;x.r=i(r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1}else{if(n==8||n==6||n<4)return null;if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");d=i(d.slice(1),16);if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1}return x};h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=pSBCr(c0),P=p<0,t=c1&&c1!="c"?pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;if(!f||!t)return null;if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)};