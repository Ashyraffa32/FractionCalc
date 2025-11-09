// DOM elements
const ribbon = document.querySelector('.ribbon');
const modeButtons = document.querySelectorAll('.dropdown-menu button[data-mode]');
const panels = document.querySelectorAll('.panel');
const toggleThemeBtn = document.getElementById('toggle-theme-btn');
const uploadBgBtn = document.getElementById('upload-bg-btn');
const fileInput = document.getElementById('bg-upload');
const resetBgBtn = document.getElementById('reset-bg-btn');
const accentColorPicker = document.getElementById('accent-color-picker');
const changeAccentBtn = document.getElementById('change-accent-btn');
const opacitySlider = document.getElementById('opacity-slider');
const toggleLangBtn = document.getElementById('toggle-lang-btn');
const calcBtn = document.getElementById('calc-btn');
const convertBtn = document.getElementById('btn-convert-mixed'); // Tombol Convert
const toggleConvertMode = document.getElementById('toggle-convert-mode');
const showExplanationCheckbox = document.getElementById('show-explanation-checkbox');
const explanationBox = document.getElementById('explanation-box');


// === Localization Data ===
const locales = {
    en: {
        // Ribbon
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
        accentColor: "Change Accent Color...",
        opacity: "Adjust Element Opacity...",
        toggleLangBtn: "Switch Language",
        help: "Help",
        about: "About",
        documentation: "Documentation",
        view: "View",
        fullscreen: "Toggle Full Screen",
        
        // Operate Panel
        howMany: "How many fractions?",
        calculate: "Calculate",
        showExplanationCheckbox: "Show Explanation",
        
        // Convert Panel
        convertToggleLabel: "Convert Improper ↔ Mixed",
        convertBtn: "Convert",
        
        // Decimal Panel
        toDecimal: "To Decimal",
        
        // Fraction Panel
        toFraction: "Convert to Fraction",
        
        // Simplify Panel
        simplifyBtn: "Simplify",
        
        // Modals
        opacityTitle: "Set Container Opacity",
        historyTitle: "Calculation History",
        clearHistory: "Clear History",
        
        // Placeholders
        whole: "Whole",
        numerator: "Numerator",
        denominator: "Denominator",
        enterDecimal: "Enter a decimal...",

        // Results & Errors
        invalidInput: "Invalid input. Check denominators (must be non-zero).",
        invalidDecimal: "Invalid decimal input.",
        decFracResult: "Fraction:",
        simplifyResult: "Simplified:",
        language: "Language",
        aboutMsg: "FractionCalc (1.6.0) - Made by Ashyraffa and Ratu",
        mixedToImproper: "Improper Fraction:",
        improperToMixed: "Mixed Number:",
        result: "Result:",
        explanation: "Explanation:",
        emptyHistory: "No history yet.",
        history: "History",

        // === ADDED: Explanation Strings ===
        expStep1: "Step 1: Convert all fractions to improper fractions.",
        expFraction: "  - Fraction {i} ({original}) = {improper}",
        expStep2: "Step 2: Find a common denominator (LCD is {lcd}).",
        expAdjust: "  - {num}/{den} becomes {scaledNum}/{lcd}",
        expStep3: "Step 3: Perform operation:",
        expOperation: "  - {expression} = {finalNum}/{lcd}",
        expStep3Multiply: "Step 3: Perform multiplication:",
        expStep3Divide: "Step 3: Perform division:",
        expOpMultiply: "  - {expression}",
        expOpDivide: "  - {expression}",
        expUnsimplified: "\nUnsimplified Result: {num}/{den}",
        expStep4: "Step 4: Simplify and convert to mixed number.",
        expSimplified: "  - Simplified: {num}/{den}",
        expFinalMixed: "  - Final Result: {result}",
    },
    id: {
        // Ribbon
        mode: "Mode",
        operate: "Operasi Pecahan",
        convert: "Campuran ↔ Biasa",
        decimal: "Pecahan → Desimal",
        fraction: "Desimal → Pecahan",
        simplify: "Sederhanakan Pecahan",
        options: "Opsi",
        toggleTheme: "Ganti Tema",
        changeWallpaper: "Ganti Wallpaper...",
        resetWallpaper: "Reset Wallpaper",
        accentColor: "Ganti Warna Aksen...",
        opacity: "Atur Opasitas Elemen...",
        toggleLangBtn: "Ganti Bahasa",
        help: "Bantuan",
        about: "Tentang",
        documentation: "Dokumentasi",
        view: "Tampilan",
        fullscreen: "Toggle Layar Penuh",

        // Operate Panel
        howMany: "Berapa banyak pecahan?",
        calculate: "Hitung",
        showExplanationCheckbox: "Tampilkan Penjelasan",

        // Convert Panel
        convertToggleLabel: "Ubah Biasa ↔ Campuran",
        convertBtn: "Ubah",

        // Decimal Panel
        toDecimal: "Ke Desimal",

        // Fraction Panel
        toFraction: "Ubah ke Pecahan",

        // Simplify Panel
        simplifyBtn: "Sederhanakan",
        
        // Modals
        opacityTitle: "Atur Opasitas Kontainer",
        historyTitle: "Riwayat Perhitungan",
        clearHistory: "Bersihkan Riwayat",

        // Placeholders
        whole: "Utuh",
        numerator: "Pembilang",
        denominator: "Penyebut",
        enterDecimal: "Masukkan desimal...",
        
        // Results & Errors
        invalidInput: "Input tidak valid. Periksa penyebut (tidak boleh nol).",
        invalidDecimal: "Input desimal tidak valid.",
        decFracResult: "Pecahan:",
        simplifyResult: "Disederhanakan:",
        language: "Bahasa",
        aboutMsg: "FractionCalc (1.6.0) - Dibuat oleh Ashyraffa dan Ratu",
        mixedToImproper: "Pecahan Biasa:",
        improperToMixed: "Pecahan Campuran:",
        result: "Hasil:",
        explanation: "Penjelasan:",
        emptyHistory: "Belum ada riwayat.",
        history: "Riwayat",
        
        // === ADDED: Explanation Strings (Indonesian) ===
        expStep1: "Langkah 1: Ubah semua pecahan menjadi pecahan biasa.",
        expFraction: "  - Pecahan {i} ({original}) = {improper}",
        expStep2: "Langkah 2: Cari penyebut yang sama (KPK adalah {lcd}).",
        expAdjust: "  - {num}/{den} menjadi {scaledNum}/{lcd}",
        expStep3: "Langkah 3: Lakukan operasi:",
        expOperation: "  - {expression} = {finalNum}/{lcd}",
        expStep3Multiply: "Langkah 3: Lakukan perkalian:",
        expStep3Divide: "Langkah 3: Lakukan pembagian:",
        expOpMultiply: "  - {expression}",
        expOpDivide: "  - {expression}",
        expUnsimplified: "\nHasil Belum Disederhanakan: {num}/{den}",
        expStep4: "Langkah 4: Sederhanakan dan ubah ke pecahan campuran.",
        expSimplified: "  - Disederhanakan: {num}/{den}",
        expFinalMixed: "  - Hasil Akhir: {result}",
    }
};

// --- Helper Functions ---

// Greatest Common Divisor
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

// Least Common Multiple
function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(Math.abs(a), Math.abs(b));
}

// Simplify a Fraction
function simplify(num, den) {
    const divisor = gcd(Math.abs(num), Math.abs(den));
    let simpNum = num / divisor;
    let simpDen = den / divisor;

    // Pastikan tanda negatif hanya ada di pembilang jika ada
    if (simpDen < 0) {
        simpNum = -simpNum;
        simpDen = -simpDen;
    }
    return { num: simpNum, den: simpDen };
}

// Convert Mixed to Improper
function convertMixedToImproper(whole, num, den) {
    if (den === 0) return null;
    let newNum = whole * den + num;
    // Perhatikan tanda negatif pada bilangan bulat
    if (whole < 0 && num > 0) {
        newNum = whole * den - num;
    } else if (whole > 0 && num < 0) {
        newNum = whole * den + num;
    }
    // Handle kasus whole negatif
    if (whole < 0) {
        newNum = whole * den - Math.abs(num);
    } else {
         newNum = whole * den + num;
    }
    return simplify(newNum, den);
}

// Convert Improper to Mixed
function convertImproperToMixed(num, den) {
    if (den === 0) return null;
    const sign = num < 0 ? -1 : 1;
    const absNum = Math.abs(num);
    const absDen = Math.abs(den);
    
    let whole = Math.floor(absNum / absDen) * sign;
    let newNum = absNum % absDen;
    let newDen = absDen;

    // Sederhanakan pecahan sisanya
    const simplifiedRemainder = simplify(newNum, newDen);
    newNum = simplifiedRemainder.num;
    newDen = simplifiedRemainder.den;
    
    return { whole: whole, num: newNum, den: newDen };
}

// Format Fraction for display
function formatFraction({ whole, num, den }) {
    if (den === 0) return "Undefined";
    if (num === 0) return whole.toString();
    if (whole === 0) return `${num}/${den}`;
    return `${whole} ${num}/${den}`;
}

// --- Core Conversion & Operation Functions ---

function simplifyFraction() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang];
    const num = parseInt(document.getElementById("simp_num").value);
    const den = parseInt(document.getElementById("simp_den").value);
    const resultEl = document.getElementById("simplify-result");

    if (isNaN(num) || isNaN(den) || den === 0) {
        resultEl.innerText = t.invalidInput;
        return;
    }

    const simplified = simplify(num, den);
    let resultStr = simplified.den === 1 ? `${simplified.num}` : `${simplified.num}/${simplified.den}`;
    resultEl.innerText = `${t.simplifyResult} ${resultStr}`;
}

// Fraction to Decimal 
function convertDecimal() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang];
    const num = parseInt(document.getElementById("dec_num").value);
    const den = parseInt(document.getElementById("dec_den").value);
    const resultEl = document.getElementById("decimal-result");

    if (isNaN(num) || isNaN(den) || den === 0) {
        resultEl.innerText = t.invalidInput;
        return;
    }
    const result = (num / den).toString();
    resultEl.innerText = result;
}

// Decimal to Fraction 
function convertDecimalToFraction() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang];
    const decInput = document.getElementById("dec_input_fraction").value;
    const resultDiv = document.getElementById("decimal-to-fraction-result");
    const decimal = parseFloat(decInput);

    if (isNaN(decimal)) {
        resultDiv.innerText = t.invalidDecimal || "Invalid input.";
        return;
    }

    // Algorithm to convert decimal to fraction (lanjutan dari kode sebelumnya)
    const tolerance = 1.0E-9; 
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimal;
    do {
        let a = Math.floor(b);
        let aux = h1; h1 = a * h1 + h2; h2 = aux;
        aux = k1; k1 = a * k1 + k2; k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

    let resultStr = (k1 === 1) ? `${h1}` : `${h1}/${k1}`;
    
    resultDiv.innerText = `${t.decFracResult} ${resultStr}`;
}

// Mixed ↔ Improper (Reconstructed)
function convertFraction() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang];
    const wholeEl = document.getElementById('conv_whole');
    const numEl = document.getElementById('conv_num');
    const denEl = document.getElementById('conv_den');
    const resultEl = document.getElementById('convert-result');
    
    const num = parseInt(numEl.value);
    const den = parseInt(denEl.value);
    const whole = parseInt(wholeEl.value) || 0; // Bilangan bulat bisa kosong

    if (isNaN(num) || isNaN(den) || den === 0) {
        resultEl.innerText = t.invalidInput;
        return;
    }

    if (toggleConvertMode.checked) {
        // Mode: Improper → Mixed
        // Input: num, den (Whole diabaikan)
        const result = convertImproperToMixed(num, den);
        if (!result) { resultEl.innerText = t.invalidInput; return; }
        
        let resultStr = result.whole !== 0 ? `${result.whole} ${result.num}/${result.den}` : `${result.num}/${result.den}`;
        if (result.num === 0) resultStr = result.whole.toString(); // Handle jika sisanya 0

        resultEl.innerText = `${t.improperToMixed} ${resultStr}`;

    } else {
        // Mode: Mixed → Improper (Default)
        // Input: whole, num, den
        const result = convertMixedToImproper(whole, num, den);
        if (!result) { resultEl.innerText = t.invalidInput; return; }

        let resultStr = result.den === 1 ? `${result.num}` : `${result.num}/${result.den}`;
        resultEl.innerText = `${t.mixedToImproper} ${resultStr}`;
    }
}


// ==========================================================
//  FIXED: calculateFraction Function (Now fully localized)
// ==========================================================
function calculateFraction() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang]; // Get translation object
    const count = parseInt(document.getElementById('fraction-count').value);
    const operator = document.getElementById('operator').value;
    const resultEl = document.getElementById('result');
    const explanationOn = showExplanationCheckbox.checked;
    explanationBox.style.display = 'none';
    explanationBox.innerText = ''; // Clear previous explanation

    let fractions = [];
    let isValid = true;
    let explanation = "";

    // 1. Parse and Convert all fractions to Improper
    if (explanationOn) explanation += t.expStep1 + '\n';
    
    for (let i = 1; i <= count; i++) {
        const whole = parseInt(document.getElementById(`whole${i}`).value) || 0;
        const num = parseInt(document.getElementById(`num${i}`).value);
        const den = parseInt(document.getElementById(`den${i}`).value);

        if (isNaN(num) || isNaN(den) || den === 0) {
            isValid = false;
            break;
        }
        
        const originalStr = `${whole !== 0 ? `${whole} ` : ''}${num}/${den}`;
        const improper = convertMixedToImproper(whole, num, den);
        fractions.push(improper);
        
        if (explanationOn) {
            explanation += t.expFraction
                .replace('{i}', i)
                .replace('{original}', originalStr)
                .replace('{improper}', `${improper.num}/${improper.den}`) + '\n';
        }
    }

    if (!isValid) {
        resultEl.innerText = t.invalidInput;
        return;
    }

    // --- LOGIC FOR + AND - (Needs Common Denominator) ---
    if (operator === '+' || operator === '-') {
        // 2. Find Common Denominator (LCD)
        let finalDen = fractions[0].den;
        for (let i = 1; i < fractions.length; i++) {
            finalDen = lcm(finalDen, fractions[i].den);
        }
        if (explanationOn) explanation += '\n' + t.expStep2.replace('{lcd}', finalDen) + '\n';

        // 3. Perform Operation
        let finalNum = 0;
        let opExpression = ""; // For explanation
        
        fractions.forEach((frac, index) => {
            const scaledNum = frac.num * (finalDen / frac.den);
            
            if (explanationOn) {
                explanation += t.expAdjust
                    .replace('{num}', frac.num)
                    .replace('{den}', frac.den)
                    .replace('{scaledNum}', scaledNum)
                    .replace('{lcd}', finalDen) + '\n';
                
                opExpression += `${index > 0 ? ` ${operator} ` : ''}(${scaledNum})`;
            }
            
            if (index === 0) {
                finalNum = scaledNum;
            } else {
                if (operator === '+') finalNum += scaledNum;
                if (operator === '-') finalNum -= scaledNum;
            }
        });

        if (explanationOn) {
            explanation += '\n' + t.expStep3 + '\n';
            explanation += t.expOperation
                .replace('{expression}', opExpression)
                .replace('{finalNum}', finalNum)
                .replace('{lcd}', finalDen) + '\n';
        }
        
        // 4. Simplify and Convert to Mixed Number
        const simplified = simplify(finalNum, finalDen);
        const finalMixed = convertImproperToMixed(simplified.num, simplified.den);
        const resultStr = formatFraction(finalMixed);
        resultEl.innerText = `${t.result} ${resultStr}`;

        if (explanationOn) {
            explanation += t.expUnsimplified.replace('{num}', finalNum).replace('{den}', finalDen) + '\n';
            explanation += '\n' + t.expStep4 + '\n';
            explanation += t.expSimplified.replace('{num}', simplified.num).replace('{den}', simplified.den) + '\n';
            explanation += t.expFinalMixed.replace('{result}', resultStr) + '\n';
            explanationBox.innerText = explanation;
            explanationBox.style.display = 'block';
        }
    
    // --- LOGIC FOR * AND / (No Common Denominator Needed) ---
    } else {
        let resultNum = fractions[0].num;
        let resultDen = fractions[0].den;
        let opExpression = `(${resultNum}/${resultDen})`;
        
        if (explanationOn) {
            explanation += '\n' + (operator === '*' ? t.expStep3Multiply : t.expStep3Divide) + '\n';
        }

        for (let i = 1; i < fractions.length; i++) {
            const frac = fractions[i];
            opExpression += ` ${operator} (${frac.num}/${frac.den})`;

            if (operator === '*') {
                resultNum *= frac.num;
                resultDen *= frac.den;
            } else if (operator === '/') {
                // Invert and multiply
                resultNum *= frac.den;
                resultDen *= frac.num;
            }
        }
        
        if (explanationOn) {
            explanation += (operator === '*' ? t.expOpMultiply : t.expOpDivide).replace('{expression}', opExpression) + '\n';
        }

        // 4. Simplify and Convert to Mixed Number
        const simplified = simplify(resultNum, resultDen);
        const finalMixed = convertImproperToMixed(simplified.num, simplified.den);
        const resultStr = formatFraction(finalMixed);
        resultEl.innerText = `${t.result} ${resultStr}`;

        if (explanationOn) {
            explanation += t.expUnsimplified.replace('{num}', resultNum).replace('{den}', resultDen) + '\n';
            explanation += '\n' + t.expStep4 + '\n';
            explanation += t.expSimplified.replace('{num}', simplified.num).replace('{den}', simplified.den) + '\n';
            explanation += t.expFinalMixed.replace('{result}', resultStr) + '\n';
            explanationBox.innerText = explanation;
            explanationBox.style.display = 'block';
        }
    }
}
// ==========================================================
//  END OF FIX
// ==========================================================


// --- Apply Settings (Theme, Wallpaper, Accent, Opacity) ---
function applySettings() {
    // Apply Theme
    const theme = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark-mode', theme === 'dark');

    // Apply Wallpaper
    const customBg = localStorage.getItem('customBackground');
    const body = document.body;
    body.classList.toggle('has-custom-bg', !!customBg);
    body.style.backgroundImage = customBg ? `url('${customBg}')` : 'none';

    // Apply Accent
    const accentColor = localStorage.getItem('accentColor');
    if (accentColor) {
        document.documentElement.style.setProperty('--btn-primary', accentColor);
        document.documentElement.style.setProperty('--accent-color', accentColor); // Ensure this is set
    }

    // Apply Opacity
    const opacity = localStorage.getItem('containerOpacity');
    document.documentElement.style.setProperty('--container-opacity', opacity || 1);

    if (opacitySlider) {
        opacitySlider.value = opacity || 1;
    }

    // Apply Language 
    updateTextForLanguage(); // <-- THIS IS THE KEY
}

// --- FIXED LOCALIZATION FUNCTION ---
function updateTextForLanguage() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang];
    if (!t) return; // Failsafe

    // Helper to find and set text
    const setText = (selector, key, isPlaceholder = false) => {
        const el = document.querySelector(selector);
        if (el) {
            if (isPlaceholder) {
                el.placeholder = t[key];
            } else {
                el.innerText = t[key];
            }
        }
    };

    // --- Ribbon ---
    // Dropdown Titles
    setText('.dropdown:nth-child(1) > button', 'mode');
    setText('.dropdown:nth-child(2) > button', 'options');
    setText('.dropdown:nth-child(3) > button', 'help');
    setText('.dropdown:nth-child(4) > button', 'view');

    // Mode Menu
    setText('button[data-mode="operate"]', 'operate');
    setText('button[data-mode="convert"]', 'convert');
    setText('button[data-mode="decimal"]', 'decimal');
    setText('button[data-mode="fraction"]', 'fraction');
    setText('button[data-mode="simplify"]', 'simplify');
    
    // Options Menu
    setText('#toggle-theme-btn', 'toggleTheme');
    setText('#upload-bg-btn', 'changeWallpaper');
    setText('#reset-bg-btn', 'resetWallpaper');
    setText('#change-accent-btn', 'accentColor');
    setText('#open-opacity-modal-btn', 'opacity');
    setText('#toggle-lang-btn', 'toggleLangBtn');

    // Help Menu
    setText('#about-btn', 'about');
    setText('#docs-btn', 'documentation');

    // View Menu
    setText('#fullscreen-btn', 'fullscreen');

    // --- Main Panels ---
    
    // Operate
    setText('label[for="fraction-count"]', 'howMany');
    setText('#calc-btn', 'calculate');
    // Special handler for label text node
    const explanationLabel = document.getElementById('show-explanation-checkbox')?.parentElement;
    if (explanationLabel && explanationLabel.lastChild.nodeType === Node.TEXT_NODE) {
        explanationLabel.lastChild.textContent = ' ' + t.showExplanationCheckbox;
    }
    
    // Convert
    setText('#btn-convert-mixed', 'convertBtn');
    // Special handler for label text node
    const convertLabel = document.getElementById('toggle-convert-mode')?.parentElement;
    if (convertLabel && convertLabel.lastChild.nodeType === Node.TEXT_NODE) {
        convertLabel.lastChild.textContent = ' ' + t.convertToggleLabel;
    }

    // Decimal
    setText('#btn-frac-to-dec', 'toDecimal');
    
    // Fraction
    setText('#btn-dec-to-frac', 'toFraction');
    
    // Simplify
    setText('#btn-simplify', 'simplifyBtn');

    // --- Placeholders ---
    const placeholderKeys = {
        'whole1': 'whole', 'num1': 'numerator', 'den1': 'denominator',
        'whole2': 'whole', 'num2': 'numerator', 'den2': 'denominator',
        'whole3': 'whole', 'num3': 'numerator', 'den3': 'denominator',
        'whole4': 'whole', 'num4': 'numerator', 'den4': 'denominator',
        'conv_whole': 'whole', 'conv_num': 'numerator', 'conv_den': 'denominator',
        'dec_num': 'numerator', 'dec_den': 'denominator',
        'simp_num': 'numerator', 'simp_den': 'denominator',
        'dec_input_fraction': 'enterDecimal'
    };

    for (const [id, key] of Object.entries(placeholderKeys)) {
        const el = document.getElementById(id);
        if (el) {
            el.placeholder = t[key];
        }
    }
    
    // --- Modals ---
    setText('#opacity-modal h4', 'opacityTitle');
    setText('#history-modal h4', 'historyTitle');
    setText('#clear-history-btn', 'clearHistory');
}
// ==========================================================
//  END OF LOCALIZATION FIX
// ==========================================================


// --- Main Event Listeners (Semua cuma di sini, tidak ada duplikat!) ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Apply Initial Settings
    applySettings(); // This will now apply all translations on load

    // 2. Button Listeners (Theme, Wallpaper, Language, Opacity Modal)

    // Dark Mode (FIXED)
    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            applySettings();
        });
    }

    // Wallpaper Change (FIXED)
    if (uploadBgBtn && fileInput && resetBgBtn) {
        uploadBgBtn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                const dataURL = evt.target.result;
                localStorage.setItem('customBackground', dataURL);
                applySettings();
                e.target.value = ''; // Reset input value
            };
            reader.readAsDataURL(file);
        });

        resetBgBtn.addEventListener('click', () => {
            localStorage.removeItem('customBackground');
            applySettings();
        });
    }

    // Accent Color
    if (changeAccentBtn && accentColorPicker) {
        changeAccentBtn.addEventListener('click', () => accentColorPicker.click());
        accentColorPicker.addEventListener('change', (e) => { // 'change' is better than 'input' for color picker
            localStorage.setItem('accentColor', e.target.value);
            applySettings();
        });
    }

    // Language Toggle (FIXED)
    if (toggleLangBtn) {
        toggleLangBtn.addEventListener('click', () => {
            const currentLang = localStorage.getItem('locale') === 'id' ? 'en' : 'id';
            localStorage.setItem('locale', currentLang);
            applySettings(); // This will re-run the updated localization function
        });
    }
    
    // Opacity Modal (Perlu buka tutup modal)
    const opacityModal = document.getElementById('opacity-modal');
    const openOpacityModalBtn = document.getElementById('open-opacity-modal-btn');
    const opacityCloseBtn = document.getElementById('opacity-close-btn');

    if (openOpacityModalBtn) {
        openOpacityModalBtn.addEventListener('click', () => {
            if (opacityModal) opacityModal.style.display = 'flex';
        });
    }
    if (opacityCloseBtn) {
        opacityCloseBtn.addEventListener('click', () => {
            if (opacityModal) opacityModal.style.display = 'none';
        });
    }


    // 3. Mode Switching (FIXED)
    modeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.target.dataset.mode;
            panels.forEach(panel => panel.classList.remove('show'));
            const activePanel = document.getElementById(`${mode}-section`);
            if (activePanel) activePanel.classList.add('show');
            
            // Atur default mode saat pertama kali ganti ke mode Convert
            if (mode === 'convert') {
                const wholeEl = document.getElementById('conv_whole');
                const slashEl = document.querySelector('#convert-section .slash');
                if (wholeEl) wholeEl.hidden = false;
                if (slashEl) slashEl.hidden = false;
                if (toggleConvertMode) toggleConvertMode.checked = false; // Default: Mixed -> Improper
            }
        });
    });

    // 4. Conversion/Operation Button Clicks (LOGIC RE-ADDED)

    // Operate Fractions
    if (calcBtn) {
        calcBtn.addEventListener('click', calculateFraction);
    }
    
    // Mixed ↔ Improper
    if (convertBtn) {
        convertBtn.addEventListener('click', convertFraction);
    }
    
    // Logic tampilan toggle Convert Mode
    if (toggleConvertMode) {
        toggleConvertMode.addEventListener('change', (e) => {
            const isImproperToMixed = e.target.checked;
            const wholeEl = document.getElementById('conv_whole');
            const slashEl = document.querySelector('#convert-section .slash');

            if (isImproperToMixed) {
                // Improper → Mixed: Hide Whole Number input
                if (wholeEl) wholeEl.hidden = true;
                if (slashEl) slashEl.hidden = true;
            } else {
                // Mixed → Improper: Show Whole Number input
                if (wholeEl) wholeEl.hidden = false;
                if (slashEl) slashEl.hidden = false;
            }
        });
    }


    // Decimal to Fraction
    const decToFracBtn = document.getElementById('btn-dec-to-frac');
    if (decToFracBtn) {
        decToFracBtn.addEventListener('click', convertDecimalToFraction);
    }

    // Fraction to Decimal
    const fracToDecBtn = document.getElementById('btn-frac-to-dec'); // ID di HTML adalah 'btn-frac-to-dec', bukan 'btn-dec'
    if (fracToDecBtn) {
        fracToDecBtn.addEventListener('click', convertDecimal);
    }
    
    // Simplify Fraction
    const simplifyBtn = document.getElementById('btn-simplify');
    if (simplifyBtn) {
        simplifyBtn.addEventListener('click', simplifyFraction);
    }

    // 5. Opacity Slider
    if (opacitySlider) {
        opacitySlider.addEventListener('input', (e) => {
            const opacity = e.target.value;
            localStorage.setItem('containerOpacity', opacity);
            applySettings();
        });
    }
    
    // 6. Fraction Count Selector (Show/Hide fraction inputs)
    const fractionCountSelect = document.getElementById('fraction-count');
    if (fractionCountSelect) {
        fractionCountSelect.addEventListener('change', (e) => {
            const count = parseInt(e.target.value);
            for (let i = 3; i <= 4; i++) {
                const fracDiv = document.getElementById(`fraction${i}`);
                if (fracDiv) {
                    fracDiv.hidden = (i > count);
                }
            }
        });
    }
    
    // Set default mode (operate-section)
    document.getElementById('operate-section').classList.add('show');
    
    // Restore Help and View functions
    document.getElementById('about-btn').addEventListener('click', () => {
        const lang = localStorage.getItem('locale') || 'en';
        alert(locales[lang].aboutMsg);
    });

    document.getElementById('docs-btn').addEventListener('click', () => {
        const url = 'https.github.com/Ashyraffa/FractionCalc-Desktop/blob/main/README.md';
        window.open(url, '_blank');
    });

    document.getElementById('fullscreen-btn').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

});

// (i'm lazy to maintain btw lol)
// (anyways this is the end of script.js haha lol go brrrrr)