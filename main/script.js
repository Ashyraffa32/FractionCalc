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

// --- Localization strings ---
const locales = {
  en: {
    mode: "Mode",
    operate: "Operate Fractions",
    convert: "Mixed ↔ Improper",
    decimal: "Fraction → Decimal",
    fraction: "Decimal → Fraction",
    options: "Options",
    toggleTheme: "Toggle Theme",
    changeWallpaper: "Change Wallpaper...",
    resetWallpaper: "Reset to Default",
    switchLang: "Switch Language",
    help: "Help",
    about: "About",
    aboutMsg: "FractionCalc For Desktop\nVersion 1.4.0\nMade by Ashyraffa and Ratu",
    documentation: "Documentation",
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
    invalidDecimal: "Invalid input."
  },
  id: {
    mode: "Mode",
    operate: "Operasi Pecahan",
    convert: "Campuran ↔ Tidak Wajar",
    decimal: "Pecahan → Desimal",
    fraction: "Desimal → Pecahan",
    options: "Opsi",
    toggleTheme: "Ganti Tema",
    changeWallpaper: "Ganti Wallpaper...",
    resetWallpaper: "Kembali ke Default",
    switchLang: "Ganti Bahasa",
    help: "Bantuan",
    about: "Tentang",
    aboutMsg: "FractionCalc Untuk Desktop\nVersi 1.4.0\nDibuat oleh Ashyraffa dan Ratu",
    documentation: "Dokumentasi",
    howMany: "Berapa banyak pecahan?",
    calculate: "Hitung",
    result: "Hasil:",
    hint: "Kosongkan \"Whole\" atau isi 0 untuk pecahan biasa. Isi \"Whole\" untuk pecahan campuran.",
    convertBtn: "Konversi",
    improper: "Pecahan Tidak Wajar:",
    invalidDen: "Penyebut tidak boleh kosong atau nol.",
    invalidInput: "Input tidak valid!",
    cannotDivide: "Tidak dapat membagi dengan nol!",
    toDecimal: "Ke Desimal",
    decimalResult: "Desimal:",
    decToFrac: "Konversi ke Pecahan",
    decFracResult: "Hasil:",
    invalidDecimal: "Input tidak valid."
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

  document.querySelectorAll('.dropdown')[1].querySelector('button').innerText = t.options;
  document.getElementById('toggle-theme-btn').innerText = t.toggleTheme;
  document.getElementById('upload-bg-btn').innerText = t.changeWallpaper;
  document.getElementById('reset-bg-btn').innerText = t.resetWallpaper;
  document.getElementById('toggle-lang-btn').innerText = t.switchLang;

  document.querySelectorAll('.dropdown')[2].querySelector('button').innerText = t.help;
  const helpBtns = document.querySelectorAll('.dropdown')[2].querySelectorAll('.dropdown-menu button');
  helpBtns[0].innerText = t.about;
  helpBtns[1].innerText = t.documentation;

  // Main UI
  document.querySelector('label[for="fraction-count"]').innerText = t.howMany;
  document.getElementById('calc-btn').innerText = t.calculate;
  document.getElementById('result').innerText = t.result;
  document.querySelector('.hint').innerText = t.hint;
  document.getElementById('btn-convert-mixed').innerText = t.convertBtn;
  document.getElementById('btn-frac-to-dec').innerText = t.toDecimal;
  document.getElementById('btn-dec-to-frac').innerText = t.decToFrac;
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
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang];
    const count = parseInt(fractionCountSelect.value);
    const operator = document.getElementById('operator').value;
    let nums = [], dens = [];

    for (let i = 1; i <= count; i++) {
        const whole = parseInt(document.getElementById('whole' + i).value) || 0;
        const num = parseInt(document.getElementById('num' + i).value) || 0;
        const den = parseInt(document.getElementById('den' + i).value);

        if (isNaN(den) || den === 0) {
            document.getElementById("result").innerText = t.invalidDen;
            return;
        }

        const impNum = Math.abs(whole) * den + num;
        nums.push(whole < 0 ? -impNum : impNum);
        dens.push(den);
    }

    let resultNum = nums[0];
    let resultDen = dens[0];

    for (let i = 1; i < count; i++) {
        switch (operator) {
            case "+":
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
                    document.getElementById("result").innerText = t.cannotDivide;
                    return;
                }
                resultNum *= dens[i];
                resultDen *= nums[i];
                break;
        }
    }

    const simplifyGCD = gcd(Math.abs(resultNum), Math.abs(resultDen));
    resultNum /= simplifyGCD;
    resultDen /= simplifyGCD;

    let resultStr = (resultDen === 1) ? `${resultNum}` : `${resultNum}/${resultDen}`;
    document.getElementById("result").innerText = `${t.result} ${resultStr}`;
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
    document.getElementById("convert-result").innerText = `${t.improper} ${resultNum}/${den}`;
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
    document.getElementById("decimal-result").innerText = `${t.decimalResult} ${num/den}`;
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
    document.getElementById("decimal-to-fraction-result").innerText = `${t.decFracResult} ${h1}/${k1}`;
}

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

// --- Event Listeners ---
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
toggleThemeBtn.addEventListener('click', toggleTheme);

uploadBgBtn.addEventListener('click', () => {
    fileInput.click();
});

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

// --- Language toggle ---
document.getElementById('toggle-lang-btn').addEventListener('click', () => {
  const current = localStorage.getItem('locale') || 'en';
  localStorage.setItem('locale', current === 'en' ? 'id' : 'en');
  applyLocale();
});

// --- About button localization ---
document.querySelectorAll('.dropdown')[2].querySelectorAll('.dropdown-menu button')[0]
  .addEventListener('click', function() {
    const lang = localStorage.getItem('locale') || 'en';
    alert(locales[lang].aboutMsg);
  });

// Initial load
document.addEventListener('DOMContentLoaded', () => {
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
    applySettings();
    updateFractionInputs();
    applyLocale();
});