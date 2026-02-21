import { locales } from './locales.js';
import { decimalToFraction, fractionToDecimal, simplifyFraction } from './conversions.js';
import { calculateFraction, convertFractionCore } from './operations.js';
import { MemoryManager, memoryUtils } from './memory.js';
import { HistoryManager } from './history.js';
import { formatFractionHTML } from './utils.js';

export function initUI() {
    // Initialize Memory and History managers
    const memoryManager = new MemoryManager();
    const historyManager = new HistoryManager();

    // Store the last calculation result for memory operations
    let lastResult = null;
    
    // Track the currently focused fraction input (defaults to 1)
    let currentFractionFocus = 1;

    // Cache frequently used elements
    const modeButtons = document.querySelectorAll('.dropdown-menu button[data-mode]');
    const panels = document.querySelectorAll('.panel');
    const calcBtn = document.getElementById('calc-btn');
    const convertBtn = document.getElementById('btn-convert-mixed');
    const toggleConvertMode = document.getElementById('toggle-convert-mode');
    const explanationBox = document.getElementById('explanation-box');

    // Options menu: Show Explanation button (replaces previous checkbox)
    const showExplanationBtn = document.getElementById('options-show-explanations-btn');

    // Apply settings and localization on load
    applySettings();

    // Setup Memory and History UI
    setupMemoryUI(memoryManager, memoryUtils, () => lastResult, () => currentFractionFocus);
    setupHistoryUI(historyManager);
    
    // Track focus on fraction inputs (whole, numerator, denominator)
    for (let i = 1; i <= 4; i++) {
        const wholeInput = document.getElementById(`whole${i}`);
        const numInput = document.getElementById(`num${i}`);
        const denInput = document.getElementById(`den${i}`);
        
        const onFocus = () => {
            currentFractionFocus = i;
        };
        
        if (wholeInput) wholeInput.addEventListener('focus', onFocus);
        if (numInput) numInput.addEventListener('focus', onFocus);
        if (denInput) denInput.addEventListener('focus', onFocus);
    }

    // Keyboard shortcuts for memory management
    document.addEventListener('keydown', (e) => {
        // Alt+M - Recall memory
        if (e.altKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            const recallBtn = document.getElementById('recall-memory');
            if (recallBtn) recallBtn.click();
        }
        // Alt+A - Add to memory (m+)
        else if (e.altKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            const addBtn = document.getElementById('add-memory');
            if (addBtn) addBtn.click();
        }
        // Alt+S - Subtract from memory (m-)
        else if (e.altKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            const subsBtn = document.getElementById('subs-memory');
            if (subsBtn) subsBtn.click();
        }
        // Alt+C - Clear memory (mc)
        else if (e.altKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            const clrBtn = document.getElementById('clr-memory');
            if (clrBtn) clrBtn.click();
        }
    });

    // Initialize show explanation state (persisted)
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

    // Operate click
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            const count = parseInt(document.getElementById('fraction-count').value);
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
                // Add to history
                const operandStrings = fractions.map(f => {
                    if (f.num === 0) return (f.whole || 0).toString();
                    if (!f.whole || f.whole === 0) return `${f.num}/${f.den}`;
                    return `${f.whole} ${f.num}/${f.den}`;
                });
                historyManager.addEntry('operate', operandStrings, res.resultStr);
            }
        });
    }

    // Convert click
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

    // Convert decimal -> fraction
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
            if (decimal === 0.143 || decimal === 143 || decimal === 1.43 || decimal === 14.3) {
                alert("All it costs is your love!\n~ Mari");
            } else if (decimal === 3.1) {
                alert("Our Dearest Mari..\nThe sun shined brighter when she was here...");
            } else if (decimal === 2.18) {
                alert("Everything is going to be okay....\n~ Basil");
            } else if (decimal === 5.23) {
                alert("My old friends weren't there when i needed them.\n~ Aubrey");
            } else if (decimal === 7.20) {
                alert("I have to tell you something.....");
            } else if (decimal === 1.1 || decimal === 1.01) {
                alert("Hey, Sunny... Can I poke your brain for a minute?\nI really love cooking and all and Mari always says I'm really good, but my parents want me to become a doctor...\nDo you think I should become a chef?\n~ Hero");
            } else if (decimal === 11.11) {
                alert("Do you remember me? It's your old friend, KEL!");
            } else if (decimal === 12.25) {
                alert("I wish i could go and watch the Omori Anniversary Concert...\n~ developer :/");
            }


        });
    }

    // Fraction -> decimal
    const fracToDecBtn = document.getElementById('btn-frac-to-dec');
    if (fracToDecBtn) {
        fracToDecBtn.addEventListener('click', () => {
            const num = parseInt(document.getElementById('dec_num').value);
            const den = parseInt(document.getElementById('dec_den').value);
            const resultEl = document.getElementById('decimal-result');
            if (isNaN(num) || isNaN(den) || den === 0) { resultEl.innerText = locales[localStorage.getItem('locale') || 'en'].invalidInput; return; }
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

    // Toggle convert mode show/hide
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

    // Opacity slider, wallpaper, theme etc. reuse existing logic
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

    // Fraction count selector
    const fractionCountSelect = document.getElementById('fraction-count');
    if (fractionCountSelect) {
        fractionCountSelect.addEventListener('change', (e) => {
            const count = parseInt(e.target.value);
            for (let i = 3; i <= 4; i++) {
                const fracDiv = document.getElementById(`fraction${i}`);
                if (fracDiv) fracDiv.hidden = (i > count);
            }
        });
    }

    // About, docs, fullscreen
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
            // Prefer Tauri dialog if available, fallback to alert
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
    if (fullscreenBtn) fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else if (document.exitFullscreen) document.exitFullscreen();
    });

    // Keyboard shortcuts
    setupKeyboardShortcuts();

    // Ensure operate section is default
    document.getElementById('operate-section').classList.add('show');
}

// ========================================
// Memory UI Setup
// ========================================
function setupMemoryUI(memoryManager, memoryUtils, getLastResult, getCurrentFractionFocus) {
    const memoryValue = document.getElementById('memory-value');

    // Update memory display
    const updateMemoryDisplay = () => {
        memoryValue.textContent = `M: ${memoryManager.getFormattedMemory()}`;
    };

    // Initial display
    updateMemoryDisplay();

    // Clear memory (mc)
    const clrBtn = document.getElementById('clr-memory');
    if (clrBtn) {
        clrBtn.addEventListener('click', () => {
            memoryManager.clear();
            updateMemoryDisplay();
        });
    }

    // Add to memory (m+)
    const addBtn = document.getElementById('add-memory');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const lang = localStorage.getItem('locale') || 'en';
            const t = locales[lang] || locales.en;
            const lastResult = getLastResult();
            if (!lastResult) {
                alert(t.noResult || 'No result to add to memory. Perform a calculation first.');
                return;
            }
            memoryManager.add(lastResult, memoryUtils);
            updateMemoryDisplay();
        });
    }

    // Subtract from memory (m-)
    const subsBtn = document.getElementById('subs-memory');
    if (subsBtn) {
        subsBtn.addEventListener('click', () => {
            const lang = localStorage.getItem('locale') || 'en';
            const t = locales[lang] || locales.en;
            const lastResult = getLastResult();
            if (!lastResult) {
                alert(t.noResult || 'No result to subtract from memory. Perform a calculation first.');
                return;
            }
            memoryManager.subtract(lastResult, memoryUtils);
            updateMemoryDisplay();
        });
    }

    // Recall memory (mr) - dynamic based on focused input
    const recallBtn = document.getElementById('recall-memory');
    if (recallBtn) {
        recallBtn.addEventListener('click', () => {
            const focusedFraction = getCurrentFractionFocus();
            const memory = memoryManager.recall();
            document.getElementById(`whole${focusedFraction}`).value = memory.whole || '';
            document.getElementById(`num${focusedFraction}`).value = memory.num || '';
            document.getElementById(`den${focusedFraction}`).value = memory.den || '';
        });
    }
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

    // Show history modal
    if (showHistoryBtn) {
        showHistoryBtn.addEventListener('click', () => {
            refreshHistoryDisplay();
            if (historyModal) historyModal.style.display = 'flex';
        });
    }

    // Close history modal
    if (historyCloseBtn) {
        historyCloseBtn.addEventListener('click', () => {
            if (historyModal) historyModal.style.display = 'none';
        });
    }

    // Refresh history display
    const refreshHistoryDisplay = () => {
        const lang = localStorage.getItem('locale') || 'en';
        const t = locales[lang] || locales.en;
        const history = historyManager.getRecent(50);
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

    // Export history
    if (historyExportBtn) {
        historyExportBtn.addEventListener('click', () => {
            const csv = historyManager.exportAsCSV();
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fraction-history-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // Clear history
    if (historyClearBtn) {
        historyClearBtn.addEventListener('click', () => {
            const lang = localStorage.getItem('locale') || 'en';
            const t = locales[lang] || locales.en;
            if (confirm(t.deleteConfirm)) {
                historyManager.clear();
                refreshHistoryDisplay();
            }
        });
    }

    // Expose delete function globally for the history entries
    window.deleteHistory = (index) => {
        const allHistory = historyManager.getHistory();
        if (index >= 0 && index < allHistory.length) {
            historyManager.deleteEntry(allHistory.length - 1 - index);
            refreshHistoryDisplay();
        }
    };

    // Expose refresh function globally
    window.refreshHistoryDisplay = refreshHistoryDisplay;
}

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

    // Restore show explanation state (pulled from localStorage)
    const showBtn = document.getElementById('options-show-explanations-btn');
    const showOn = localStorage.getItem('showExplanation') === 'true';
    if (showBtn) {
        showBtn.setAttribute('aria-pressed', showOn ? 'true' : 'false');
        showBtn.classList.toggle('active', showOn);
    }
}

// Languages Switching Logic
export function updateTextForLanguage() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = locales[lang] || locales.en;

    const setText = (selector, key, isPlaceholder = false) => {
        const el = document.querySelector(selector);
        if (!el) return;
        if (isPlaceholder) el.placeholder = t[key]; else el.innerText = t[key];
    };

    // Ribbon titles (1: Mode, 2: Settings, 3: Options, 4: View, 5: Help)
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

    setText('#toggle-theme-btn','toggleTheme');
    setText('#open-opacity-modal-btn','opacity');
    setText('#about-btn','about');
    setText('#docs-btn','documentation');
    setText('#fullscreen-btn','fullscreen');

    const showBtn = document.getElementById('options-show-explanations-btn');
    if (showBtn) showBtn.innerText = t.showExplanationCheckbox;

    const convertLabel = document.getElementById('toggle-convert-mode')?.parentElement;
    if (convertLabel && convertLabel.lastChild.nodeType === Node.TEXT_NODE) convertLabel.lastChild.textContent = ' ' + t.convertToggleLabel;

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
        if (el) el.placeholder = t[key];
    }

    setText('#opacity-modal h4', 'opacityTitle');

    // Update hardcoded UI text
    const howManyLabel = document.getElementById('howMany-label');
    if (howManyLabel) howManyLabel.textContent = t.howMany;
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        const modals = document.querySelectorAll('.modal');
        const openModal = Array.from(modals).find(m => getComputedStyle(m).display !== 'none');
        if (e.key === 'Escape' && openModal) { openModal.style.display = 'none'; return; }
        if (openModal) return;
        if ((e.ctrlKey || e.metaKey) && (e.key === 't' || e.key === 'T')) { e.preventDefault(); const btn = document.getElementById('toggle-theme-btn'); if (btn) btn.click(); }
        if (e.altKey) {
            const modes = ['operate', 'convert', 'decimal', 'fraction', 'simplify'];
            const keyNum = parseInt(e.key);
            if (keyNum >= 1 && keyNum <= 5) {
                const modeName = modes[keyNum - 1];
                const modeBtn = document.querySelector(`button[data-mode="${modeName}"]`);
                if (modeBtn) modeBtn.click();
            }
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'e' || e.key === 'E')) {
            e.preventDefault(); const operatePanel = document.getElementById('operate-section'); if (operatePanel && operatePanel.classList.contains('show')) { const btn = document.getElementById('options-show-explanations-btn'); if (btn) btn.click(); }
        }
        if (e.key === 'Enter') {
            const activePanel = document.querySelector('.panel.show');
            if (activePanel) {
                switch(activePanel.id) {
                    case 'operate-section': document.getElementById('calc-btn').click(); break;
                    case 'convert-section': document.getElementById('btn-convert-mixed').click(); break;
                    case 'decimal-section': document.getElementById('btn-frac-to-dec').click(); break;
                    case 'fraction-section': document.getElementById('btn-dec-to-frac').click(); break;
                    case 'simplify-section': document.getElementById('btn-simplify').click(); break;
                }
            }
        }
    });
}
