import { locales } from './locales.js';
import { decimalToFraction, fractionToDecimal, simplifyFraction } from './conversions.js';
import { calculateFraction, convertFractionCore } from './operations.js';
import { MemoryManager, memoryUtils } from './memory.js';
import { HistoryManager } from './history.js';
import { formatFractionHTML } from './utils.js';

export function initUI() {
    const memoryManager = new MemoryManager();
    const historyManager = new HistoryManager();

    let lastResult = null;
    let currentFractionFocus = 1;

    // ----------------------------------------
    // renderFractions - di dalam initUI supaya
    // bisa akses currentFractionFocus
    // ----------------------------------------
    function renderFractions(count) {
        const container = document.getElementById('fractions-container');
        if (!container) return;
        const lang = localStorage.getItem('locale') || 'en';
        const t = locales[lang] || locales.en;
        container.innerHTML = '';
        for (let i = 1; i <= count; i++) {
            const div = document.createElement('div');
            div.className = 'fraction';
            div.id = `fraction${i}`;
            div.innerHTML = `
                <input type="number" id="whole${i}" placeholder="${t.whole}" class="input small">
                <div class="slash"> </div>
                <input type="number" id="num${i}" placeholder="${t.numerator}" class="input">
                <span class="sep">/</span>
                <input type="number" id="den${i}" placeholder="${t.denominator}" class="input">
            `;
            container.appendChild(div);
        }
        // Attach focus tracker ke semua input yang baru dirender
        for (let i = 1; i <= count; i++) {
            ['whole', 'num', 'den'].forEach(field => {
                const el = document.getElementById(`${field}${i}`);
                if (el) el.addEventListener('focus', () => { currentFractionFocus = i; });
            });
        }
    }

    // Cache elements
    const modeButtons = document.querySelectorAll('.dropdown-menu button[data-mode]');
    const panels = document.querySelectorAll('.panel');
    const calcBtn = document.getElementById('calc-btn');
    const convertBtn = document.getElementById('btn-convert-mixed');
    const toggleConvertMode = document.getElementById('toggle-convert-mode');
    const explanationBox = document.getElementById('explanation-box');
    const showExplanationBtn = document.getElementById('options-show-explanations-btn');
    const fractionCountSelect = document.getElementById('fraction-count');

    // Apply settings dulu sebelum render fractions
    applySettings();

    // Render default 2 fractions
    renderFractions(2);

    // Hook select ke renderFractions
    if (fractionCountSelect) {
        fractionCountSelect.addEventListener('change', () => {
            renderFractions(parseInt(fractionCountSelect.value));
        });
    }

    // Setup Memory dan History UI
    setupMemoryUI(memoryManager, memoryUtils, () => lastResult, () => currentFractionFocus);
    setupHistoryUI(historyManager);

    // Keyboard shortcuts memory
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            document.getElementById('recall-memory')?.click();
        } else if (e.altKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            document.getElementById('add-memory')?.click();
        } else if (e.altKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            document.getElementById('subs-memory')?.click();
        } else if (e.altKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            document.getElementById('clr-memory')?.click();
        }
    });

    // Show explanation toggle
    const initShowExplanation = () => {
        const showOn = localStorage.getItem('showExplanation') === 'true';
        if (showExplanationBtn) {
            showExplanationBtn.setAttribute('aria-pressed', showOn ? 'true' : 'false');
            showExplanationBtn.classList.toggle('active', showOn);
            showExplanationBtn.addEventListener('click', () => {
                const on = showExplanationBtn.getAttribute('aria-pressed') === 'true' ? 'false' : 'true';
                showExplanationBtn.setAttribute('aria-pressed', on);
                showExplanationBtn.classList.toggle('active', on === 'true');
                localStorage.setItem('showExplanation', on === 'true');
            });
        }
    };
    initShowExplanation();

    const getShowExplanationState = () => (showExplanationBtn && showExplanationBtn.getAttribute('aria-pressed') === 'true');

    // Mode switching
    modeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.target.dataset.mode;
            panels.forEach(panel => panel.classList.remove('show'));
            const activePanel = document.getElementById(`${mode}-section`);
            if (activePanel) activePanel.classList.add('show');
            if (mode === 'convert') {
                const wholeEl = document.getElementById('conv_whole');
                const slashEl = document.querySelector('#convert-section .slash');
                if (wholeEl) wholeEl.hidden = false;
                if (slashEl) slashEl.hidden = false;
                if (toggleConvertMode) toggleConvertMode.checked = false;
            }
        });
    });

    // Calculate button
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const count = parseInt(fractionCountSelect.value);
            const operator = document.getElementById('operator').value;
            const t = locales[localStorage.getItem('locale') || 'en'];
            const fractions = [];
            for (let i = 1; i <= count; i++) {
                fractions.push({
                    whole: parseInt(document.getElementById(`whole${i}`).value) || 0,
                    num: parseInt(document.getElementById(`num${i}`).value),
                    den: parseInt(document.getElementById(`den${i}`).value)
                });
            }
            const res = calculateFraction(fractions, operator, getShowExplanationState(), t);
            const resultEl = document.getElementById('result');
            if (res.error) {
                resultEl.innerText = res.error;
                explanationBox.style.display = 'none';
                lastResult = null;
            } else {
                lastResult = res.resultFraction;
                const labelText = t.result || 'Result:';
                resultEl.innerHTML = `<div style="margin: 20px 0;"><strong>${labelText}</strong></div>${res.resultHTML}`;
                if (res.showExplanation) {
                    explanationBox.innerText = res.explanation;
                    explanationBox.style.display = 'block';
                } else {
                    explanationBox.style.display = 'none';
                }
                const operandStrings = fractions.map(f => {
                    if (f.num === 0) return (f.whole || 0).toString();
                    if (!f.whole || f.whole === 0) return `${f.num}/${f.den}`;
                    return `${f.whole} ${f.num}/${f.den}`;
                });
                historyManager.addEntry('operate', operandStrings, res.resultStr);
            }
        });
    }

    // Convert button
    if (convertBtn) {
        convertBtn.addEventListener('click', () => {
            const t = locales[localStorage.getItem('locale') || 'en'];
            const whole = parseInt(document.getElementById('conv_whole').value) || 0;
            const num = parseInt(document.getElementById('conv_num').value);
            const den = parseInt(document.getElementById('conv_den').value);
            const res = convertFractionCore({ whole, num, den }, toggleConvertMode.checked, t);
            const resultEl = document.getElementById('convert-result');
            if (res.error) {
                resultEl.innerText = res.error;
                lastResult = null;
            } else {
                lastResult = res.resultFraction;
                const labelText = toggleConvertMode.checked ? t.improperToMixed : t.mixedToImproper;
                resultEl.innerHTML = `<div style="margin: 20px 0;"><strong>${labelText}</strong></div>${res.resultHTML}`;
            }
        });
    }

    // Decimal -> Fraction
    const decToFracBtn = document.getElementById('btn-dec-to-frac');
    if (decToFracBtn) {
        decToFracBtn.addEventListener('click', () => {
            const t = locales[localStorage.getItem('locale') || 'en'];
            const decimal = parseFloat(document.getElementById('dec_input_fraction').value);
            const resultDiv = document.getElementById('decimal-to-fraction-result');
            if (isNaN(decimal)) { resultDiv.innerText = t.invalidDecimal; lastResult = null; return; }
            const frac = decimalToFraction(decimal);
            lastResult = { whole: 0, num: frac.num, den: frac.den };
            const resultHTML = formatFractionHTML({whole: 0, num: frac.num, den: frac.den});
            resultDiv.innerHTML = `<div style="margin: 20px 0;"><strong>${t.decFracResult}</strong></div>${resultHTML}`;

            // Omori Easter Eggs
            const omoriEggs = {
                '0.143': ["All it costs is your love!\n~ Mari"],
                '143':   ["All it costs is your love!\n~ Mari"],
                '1.43':  ["All it costs is your love!\n~ Mari"],
                '14.3':  ["All it costs is your love!\n~ Mari"],
                '3.1': [ // Mari's Birthday
                    "Our Dearest Mari...\nThe sun shined brighter when she was here...",
                ],
                '2.18': [ // Basil's Birthday
                    "Everything is going to be okay....\n~ Basil",
                ],
                '5.23': [ // Aubrey's Birthday
                    "My old friends weren't there for me when I needed them.\nYou and Sunny think you can just barge back into my life and tell me what to do?\nDon't be so naive.",
                    "No matter how far you push your feelings down... they'll always come back somehow. And what you do with those feelings...\nThat will be your truth.\n ~ Aubrey"
                ],
                '7.2': [ // Sunny's Birthday
                    "I have to tell you something.....",
                    "I-",
                    "I'm the one who killed Mari. and Basil is the one who mask Mari's death so it's looks like a suicide.\n ~ Sunny"
                ],
                '1.1': [ // Hero's Birthday
                    "Hey, Sunny... Can I poke your brain for a minute?",
                    "I really love cooking and all and Mari always says I'm really good.",
                    "but my parents wants me to became a doctor...",
                    "Do you think i should became a chef?\n ~ Hero"
                ],
                '1.01': [
                    "Hey, Sunny... Can I poke your brain for a minute?",
                    "I really love cooking and all and Mari always says I'm really good.",
                    "but my parents wants me to became a doctor...",
                    "Do you think i should became a chef?\n ~ Hero"
                ],
                '11.11': [ // Kel's Birthday
                    "PINK IS A GROSS COLOR!!\n~ Kel",
                ],
                '12.25': [ // Omori Anniversary
                    "I wish i could go and watch the Omori Anniversary Concert...\n~ developer :/",
                ]
            };

            const eggLines = omoriEggs[String(decimal)];
            if (eggLines) {
                (async () => {
                    for (const line of eggLines) {
                        await new Promise(resolve => {
                            try {
                                if (window.__TAURI__?.dialog?.message) {
                                    window.__TAURI__.dialog.message(line, { title: '...' }).then(resolve);
                                } else {
                                    alert(line);
                                    resolve();
                                }
                            } catch {
                                alert(line);
                                resolve();
                            }
                        });
                    }
                })();
            }
        });
    }

    // Fraction -> Decimal
    const fracToDecBtn = document.getElementById('btn-frac-to-dec');
    if (fracToDecBtn) {
        fracToDecBtn.addEventListener('click', () => {
            const num = parseInt(document.getElementById('dec_num').value);
            const den = parseInt(document.getElementById('dec_den').value);
            const resultEl = document.getElementById('decimal-result');
            if (isNaN(num) || isNaN(den) || den === 0) {
                resultEl.innerText = locales[localStorage.getItem('locale') || 'en'].invalidInput;
                return;
            }
            resultEl.innerText = fractionToDecimal(num, den).toString();
        });
    }

    // Simplify
    const simplifyBtn = document.getElementById('btn-simplify');
    if (simplifyBtn) {
        simplifyBtn.addEventListener('click', () => {
            const t = locales[localStorage.getItem('locale') || 'en'];
            const num = parseInt(document.getElementById('simp_num').value);
            const den = parseInt(document.getElementById('simp_den').value);
            const resultEl = document.getElementById('simplify-result');
            if (isNaN(num) || isNaN(den) || den === 0) { resultEl.innerText = t.invalidInput; lastResult = null; return; }
            const s = simplifyFraction(num, den);
            lastResult = { whole: 0, num: s.num, den: s.den };
            const resultHTML = s.den === 1 ? `<div class='fraction-result'>${s.num}</div>` : formatFractionHTML({whole: 0, num: s.num, den: s.den});
            resultEl.innerHTML = `<div style="margin: 20px 0;"><strong>${t.simplifyResult}</strong></div>${resultHTML}`;
        });
    }

    // Toggle convert mode (improper <-> mixed)
    if (toggleConvertMode) {
        toggleConvertMode.addEventListener('change', (e) => {
            const isImproperToMixed = e.target.checked;
            const wholeEl = document.getElementById('conv_whole');
            const slashEl = document.querySelector('#convert-section .slash');
            if (isImproperToMixed) {
                if (wholeEl) wholeEl.hidden = true;
                if (slashEl) slashEl.hidden = true;
            } else {
                if (wholeEl) wholeEl.hidden = false;
                if (slashEl) slashEl.hidden = false;
            }
        });
    }

    // Opacity, wallpaper, theme, lang
    const openOpacityModalBtn = document.getElementById('open-opacity-modal-btn');
    const opacityModal = document.getElementById('opacity-modal');
    const opacityCloseBtn = document.getElementById('opacity-close-btn');
    const opacitySlider = document.getElementById('opacity-slider');
    const toggleThemeBtn = document.getElementById('toggle-theme-btn');
    const toggleLangBtn = document.getElementById('toggle-lang-btn');
    const uploadBgBtn = document.getElementById('upload-bg-btn');
    const fileInput = document.getElementById('bg-upload');
    const resetBgBtn = document.getElementById('reset-bg-btn');
    const changeAccentBtn = document.getElementById('change-accent-btn');
    const accentColorPicker = document.getElementById('accent-color-picker');

    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            applySettings();
        });
    }

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
                e.target.value = '';
            };
            reader.readAsDataURL(file);
        });
        resetBgBtn.addEventListener('click', () => { localStorage.removeItem('customBackground'); applySettings(); });
    }

    if (changeAccentBtn && accentColorPicker) {
        changeAccentBtn.addEventListener('click', () => accentColorPicker.click());
        accentColorPicker.addEventListener('change', (e) => { localStorage.setItem('accentColor', e.target.value); applySettings(); });
    }

    if (toggleLangBtn) {
        toggleLangBtn.addEventListener('click', () => {
            const currentLang = localStorage.getItem('locale') === 'id' ? 'en' : 'id';
            localStorage.setItem('locale', currentLang);
            applySettings();
        });
    }

    if (openOpacityModalBtn) {
        openOpacityModalBtn.addEventListener('click', () => { if (opacityModal) opacityModal.style.display = 'flex'; });
    }
    if (opacityCloseBtn) {
        opacityCloseBtn.addEventListener('click', () => { if (opacityModal) opacityModal.style.display = 'none'; });
    }
    if (opacitySlider) {
        opacitySlider.addEventListener('input', (e) => { localStorage.setItem('containerOpacity', e.target.value); applySettings(); });
    }

    // About, docs, fullscreen, tip
    const aboutBtn = document.getElementById('about-btn');
    const docsBtn = document.getElementById('docs-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const tipBtn = document.getElementById('tip-of-day-btn');

    if (tipBtn) {
        tipBtn.addEventListener('click', () => {
            const lang = localStorage.getItem('locale') || 'en';
            const t = locales[lang] || locales.en;
            const tips = t.tips || [t.tipOfDay || 'Tip of the day not available.'];
            const tip = tips[Math.floor(Math.random() * tips.length)];
            try {
                if (window.__TAURI__ && window.__TAURI__.dialog && window.__TAURI__.dialog.message) {
                    window.__TAURI__.dialog.message(tip, { title: t.tipOfDay });
                } else {
                    alert(tip);
                }
            } catch (err) {
                alert(tip);
            }
        });
    }
    if (aboutBtn) aboutBtn.addEventListener('click', () => { const lang = localStorage.getItem('locale') || 'en'; alert(locales[lang].aboutMsg); });
    if (docsBtn) docsBtn.addEventListener('click', () => { window.open('https://ashyraffa32.github.io/FractionCalcSite/getstarted.html', '_blank'); });
    const clearAllBtn = document.getElementById('clear-all-btn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            const count = parseInt(fractionCountSelect.value);
            for (let i = 1; i <= count; i++) {
                ['whole', 'num', 'den'].forEach(field => {
                    const el = document.getElementById(`${field}${i}`);
                    if (el) el.value = '';
                });
            }
            const resultEl = document.getElementById('result');
            if (resultEl) resultEl.innerHTML = '';
            if (explanationBox) { explanationBox.innerText = ''; explanationBox.style.display = 'none'; }
            lastResult = null;
        });
    }

    if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else if (document.exitFullscreen) document.exitFullscreen();
    });

    // Keyboard shortcuts
    setupKeyboardShortcuts();

    // Ensure operate section is default active
    document.getElementById('operate-section')?.classList.add('show');
}

// ========================================
// Memory UI Setup
// ========================================
function setupMemoryUI(memoryManager, memoryUtils, getLastResult, getCurrentFractionFocus) {
    const memoryValue = document.getElementById('memory-value');

    const updateMemoryDisplay = () => {
        if (memoryValue) memoryValue.textContent = `M: ${memoryManager.getFormattedMemory()}`;
    };

    updateMemoryDisplay();

    document.getElementById('clr-memory')?.addEventListener('click', () => {
        memoryManager.clear();
        updateMemoryDisplay();
    });

    document.getElementById('add-memory')?.addEventListener('click', () => {
        const lang = localStorage.getItem('locale') || 'en';
        const t = locales[lang] || locales.en;
        const lastResult = getLastResult();
        if (!lastResult) { alert(t.noResult || 'No result to add. Perform a calculation first.'); return; }
        memoryManager.add(lastResult, memoryUtils);
        updateMemoryDisplay();
    });

    document.getElementById('subs-memory')?.addEventListener('click', () => {
        const lang = localStorage.getItem('locale') || 'en';
        const t = locales[lang] || locales.en;
        const lastResult = getLastResult();
        if (!lastResult) { alert(t.noResult || 'No result to subtract. Perform a calculation first.'); return; }
        memoryManager.subtract(lastResult, memoryUtils);
        updateMemoryDisplay();
    });

    document.getElementById('recall-memory')?.addEventListener('click', () => {
        const focusedFraction = getCurrentFractionFocus();
        const memory = memoryManager.recall();
        const wholeEl = document.getElementById(`whole${focusedFraction}`);
        const numEl = document.getElementById(`num${focusedFraction}`);
        const denEl = document.getElementById(`den${focusedFraction}`);
        if (wholeEl) wholeEl.value = memory.whole || '';
        if (numEl) numEl.value = memory.num || '';
        if (denEl) denEl.value = memory.den || '';
    });
}

// ========================================
// History UI Setup
// ========================================
function setupHistoryUI(historyManager) {
    const historyModal = document.getElementById('history-modal');
    const historyList = document.getElementById('history-list');
    const showHistoryBtn = document.getElementById('show-history-btn');
    const historyCloseBtn = document.getElementById('history-close-btn');
    const historyExportBtn = document.getElementById('history-export-btn');
    const historyClearBtn = document.getElementById('history-clear-btn');

    const refreshHistoryDisplay = () => {
        const lang = localStorage.getItem('locale') || 'en';
        const t = locales[lang] || locales.en;
        const history = historyManager.getRecent(50);
        if (!historyList) return;
        if (history.length === 0) {
            historyList.innerHTML = `<div class="empty-history">${t.emptyHistory}</div>`;
            return;
        }
        historyList.innerHTML = history.map((entry, idx) => `
            <div class="history-entry">
                <div class="history-entry-text">
                    <strong>${entry.operands.join(' ')}</strong> = ${entry.result}
                    <br><small style="opacity: 0.7;">${entry.timestamp}</small>
                </div>
                <button class="history-entry-delete" onclick="deleteHistory(${idx})">×</button>
            </div>
        `).join('');
    };

    showHistoryBtn?.addEventListener('click', () => {
        refreshHistoryDisplay();
        if (historyModal) historyModal.style.display = 'flex';
    });

    historyCloseBtn?.addEventListener('click', () => {
        if (historyModal) historyModal.style.display = 'none';
    });

    historyExportBtn?.addEventListener('click', () => {
        const csv = historyManager.exportAsCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fraction-history-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    });

    historyClearBtn?.addEventListener('click', () => {
        const lang = localStorage.getItem('locale') || 'en';
        const t = locales[lang] || locales.en;
        if (confirm(t.deleteConfirm)) {
            historyManager.clear();
            refreshHistoryDisplay();
        }
    });

    window.deleteHistory = (index) => {
        const allHistory = historyManager.getHistory();
        if (index >= 0 && index < allHistory.length) {
            historyManager.deleteEntry(allHistory.length - 1 - index);
            refreshHistoryDisplay();
        }
    };

    window.refreshHistoryDisplay = refreshHistoryDisplay;
}

// ========================================
// Apply Settings
// ========================================
export function applySettings() {
    const theme = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark-mode', theme === 'dark');

    const customBg = localStorage.getItem('customBackground');
    document.body.classList.toggle('has-custom-bg', !!customBg);
    document.body.style.backgroundImage = customBg ? `url('${customBg}')` : 'none';

    const accentColor = localStorage.getItem('accentColor');
    if (accentColor) {
        document.documentElement.style.setProperty('--btn-primary', accentColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);
    }

    const opacity = localStorage.getItem('containerOpacity');
    document.documentElement.style.setProperty('--container-opacity', opacity || 1);
    const opacitySlider = document.getElementById('opacity-slider');
    if (opacitySlider) opacitySlider.value = opacity || 1;

    updateTextForLanguage();

    const showBtn = document.getElementById('options-show-explanations-btn');
    const showOn = localStorage.getItem('showExplanation') === 'true';
    if (showBtn) {
        showBtn.setAttribute('aria-pressed', showOn ? 'true' : 'false');
        showBtn.classList.toggle('active', showOn);
    }
}

// ========================================
// Language / Localization
// ========================================
export function updateTextForLanguage() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang] || locales.en;

    const setText = (selector, key, isPlaceholder = false) => {
        const el = document.querySelector(selector);
        if (!el) return;
        if (isPlaceholder) el.placeholder = t[key]; else el.innerText = t[key];
    };

    // Ribbon
    setText('.ribbon .dropdown:nth-child(1) > button', 'mode');
    setText('.ribbon .dropdown:nth-child(2) > button', 'settings');
    setText('.ribbon .dropdown:nth-child(3) > button', 'options');
    setText('.ribbon .dropdown:nth-child(4) > button', 'view');
    setText('.ribbon .dropdown:nth-child(5) > button', 'help');

    setText('button[data-mode="operate"]', 'operate');
    setText('button[data-mode="convert"]', 'convert');
    setText('button[data-mode="decimal"]', 'decimal');
    setText('button[data-mode="fraction"]', 'fraction');
    setText('button[data-mode="simplify"]', 'simplify');
    setText('#clr-memory', 'clr');
    setText('#add-memory', 'add');
    setText('#subs-memory', 'subs');
    setText('#recall-memory', 'recall');
    setText('#show-history-btn', 'showHistory');
    setText('#btn-convert-mixed', 'convertBtn');
    setText('#btn-frac-to-dec', 'toDecimal');
    setText('#btn-dec-to-frac', 'toFraction');
    setText('#btn-simplify', 'simplifyBtn');
    setText('#toggle-theme-btn', 'toggleTheme');
    setText('#open-opacity-modal-btn', 'opacity');
    setText('#about-btn', 'about');
    setText('#docs-btn', 'documentation');
    setText('#fullscreen-btn', 'fullscreen');

    const showBtn = document.getElementById('options-show-explanations-btn');
    if (showBtn) showBtn.innerText = t.showExplanationCheckbox;

    const convertLabel = document.getElementById('toggle-convert-mode')?.parentElement;
    if (convertLabel && convertLabel.lastChild.nodeType === Node.TEXT_NODE) {
        convertLabel.lastChild.textContent = ' ' + t.convertToggleLabel;
    }

    // Placeholders statik (non-fraction-container)
    const staticPlaceholders = {
        'conv_whole': 'whole', 'conv_num': 'numerator', 'conv_den': 'denominator',
        'dec_num': 'numerator', 'dec_den': 'denominator',
        'simp_num': 'numerator', 'simp_den': 'denominator',
        'dec_input_fraction': 'enterDecimal'
    };
    for (const [id, key] of Object.entries(staticPlaceholders)) {
        const el = document.getElementById(id);
        if (el) el.placeholder = t[key];
    }

    // Placeholders dinamis di fractions-container
    document.querySelectorAll('#fractions-container .fraction').forEach((div, idx) => {
        const i = idx + 1;
        const wholeEl = document.getElementById(`whole${i}`);
        const numEl = document.getElementById(`num${i}`);
        const denEl = document.getElementById(`den${i}`);
        if (wholeEl) wholeEl.placeholder = t.whole;
        if (numEl) numEl.placeholder = t.numerator;
        if (denEl) denEl.placeholder = t.denominator;
    });

    setText('#opacity-modal h4', 'opacityTitle');

    const howManyLabel = document.getElementById('howMany-label');
    if (howManyLabel) howManyLabel.textContent = t.howMany;
}

// ========================================
// Keyboard Shortcuts
// ========================================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        const modals = document.querySelectorAll('.modal');
        const openModal = Array.from(modals).find(m => getComputedStyle(m).display !== 'none');
        if (e.key === 'Escape' && openModal) { openModal.style.display = 'none'; return; }
        if (openModal) return;

        if ((e.ctrlKey || e.metaKey) && (e.key === 't' || e.key === 'T')) {
            e.preventDefault();
            document.getElementById('toggle-theme-btn')?.click();
        }

        if (e.altKey) {
            const modes = ['operate', 'convert', 'decimal', 'fraction', 'simplify'];
            const keyNum = parseInt(e.key);
            if (keyNum >= 1 && keyNum <= 5) {
                const modeBtn = document.querySelector(`button[data-mode="${modes[keyNum - 1]}"]`);
                if (modeBtn) modeBtn.click();
            }
        }

        if ((e.ctrlKey || e.metaKey) && (e.key === 'e' || e.key === 'E')) {
            e.preventDefault();
            const operatePanel = document.getElementById('operate-section');
            if (operatePanel && operatePanel.classList.contains('show')) {
                document.getElementById('options-show-explanations-btn')?.click();
            }
        }

        if (e.key === 'Enter') {
            const activePanel = document.querySelector('.panel.show');
            if (activePanel) {
                switch (activePanel.id) {
                    case 'operate-section': document.getElementById('calc-btn')?.click(); break;
                    case 'convert-section': document.getElementById('btn-convert-mixed')?.click(); break;
                    case 'decimal-section': document.getElementById('btn-frac-to-dec')?.click(); break;
                    case 'fraction-section': document.getElementById('btn-dec-to-frac')?.click(); break;
                    case 'simplify-section': document.getElementById('btn-simplify')?.click(); break;
                }
            }
        }
    });
}
