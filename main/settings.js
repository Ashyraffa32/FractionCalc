// ========================================
// Settings Page - Complete Rewrite
// ========================================

class SettingsManager {
    constructor() {
        this.isDark = localStorage.getItem('theme') === 'dark';
        this.locale = localStorage.getItem('locale') || 'en';
        
        // Localization data
        this.locales = {
            en: {
                general: 'General',
                personalization: 'Personalization',
                about: 'About',
                language: 'Language',
                deleteAllData: 'Delete All User Data',
                darkMode: 'Dark Mode',
                changeWallpaper: 'Change Wallpaper',
                selectImage: 'Select Image',
                resetWallpaper: 'Reset Wallpaper',
                accentColor: 'Accent Color',
                containerOpacity: 'Container Opacity',
                resetSettings: 'Reset Settings',
                version: 'Version',
                versionNumber: '2.0.1',
                legal: 'Legal / License',
                back: 'Back',
                english: 'English',
                bahasa: 'Bahasa Indonesia',
                german: 'Deutsch',
                japanese: '日本語',
                resetConfirm: 'Reset personalization settings?',
                resetSuccess: 'Settings reset!',
                deleteConfirm: 'Delete ALL data? This cannot be undone!',
                deleteSuccess: 'All data deleted!',
                wallpaperApplied: 'New wallpaper applied.',
                wallpaperReset: 'Wallpaper reset!',
                confirm: 'Confirm',
                warning: 'WARNING',
                success: 'Success'
            },
            id: {
                general: 'Umum',
                personalization: 'Personalisasi',
                about: 'Tentang',
                language: 'Bahasa',
                deleteAllData: 'Hapus Semua Data Pengguna',
                darkMode: 'Mode Gelap',
                changeWallpaper: 'Ganti Wallpaper',
                selectImage: 'Pilih Gambar',
                resetWallpaper: 'Reset Wallpaper',
                accentColor: 'Warna Aksen',
                containerOpacity: 'Opasitas Kontainer',
                resetSettings: 'Reset Pengaturan',
                version: 'Versi',
                versionNumber: '2.0.1',
                legal: 'Lisensi / Hukum',
                back: 'Kembali',
                english: 'English',
                bahasa: 'Bahasa Indonesia',
                german: 'Deutsch',
                japanese: '日本語',
                resetConfirm: 'Reset pengaturan personalisasi?',
                resetSuccess: 'Pengaturan direset!',
                deleteConfirm: 'Hapus SEMUA data? Ini tidak dapat dibatalkan!',
                deleteSuccess: 'Semua data dihapus!',
                wallpaperApplied: 'Wallpaper baru diterapkan.',
                wallpaperReset: 'Wallpaper direset!',
                confirm: 'Konfirmasi',
                warning: 'PERINGATAN',
                success: 'Berhasil'
            },
            de: {
                general: 'Allgemein',
                personalization: 'Personalisierung',
                about: 'Über',
                language: 'Sprache',
                deleteAllData: 'Alle Benutzerdaten löschen',
                darkMode: 'Dunkler Modus',
                changeWallpaper: 'Hintergrund ändern',
                selectImage: 'Bild auswählen',
                resetWallpaper: 'Hintergrund zurücksetzen',
                accentColor: 'Akzentfarbe',
                containerOpacity: 'Containerdeckkraft',
                resetSettings: 'Einstellungen zurücksetzen',
                version: 'Version',
                versionNumber: '2.0.1',
                legal: 'Rechtliches / Lizenz',
                back: 'Zurück',
                english: 'English',
                bahasa: 'Bahasa Indonesia',
                german: 'Deutsch',
                japanese: '日本語',
                resetConfirm: 'Personalisierungseinstellungen zurücksetzen?',
                resetSuccess: 'Einstellungen zurückgesetzt!',
                deleteConfirm: 'ALLE Daten löschen? Dies kann nicht rückgängig gemacht werden!',
                deleteSuccess: 'Alle Daten gelöscht!',
                wallpaperApplied: 'Neuer Hintergrund angewendet.',
                wallpaperReset: 'Hintergrund zurückgesetzt!',
                confirm: 'Bestätigen',
                warning: 'WARNUNG',
                success: 'Erfolg'
            },
            jp: {
                general: '一般',
                personalization: 'カスタマイズ',
                about: 'について',
                language: '言語',
                deleteAllData: 'すべてのユーザーデータを削除',
                darkMode: 'ダークモード',
                changeWallpaper: '壁紙を変更',
                selectImage: '画像を選択',
                resetWallpaper: '壁紙をリセット',
                accentColor: 'アクセントカラー',
                containerOpacity: 'コンテナの不透明度',
                resetSettings: '設定をリセット',
                version: 'バージョン',
                versionNumber: '2.0.1',
                legal: '法務 / ライセンス',
                back: '戻る',
                english: 'English',
                bahasa: 'Bahasa Indonesia',
                german: 'Deutsch',
                japanese: '日本語',
                resetConfirm: 'パーソナライズ設定をリセットしますか?',
                resetSuccess: '設定がリセットされました!',
                deleteConfirm: 'すべてのデータを削除しますか? これは元に戻すことができません!',
                deleteSuccess: 'すべてのデータが削除されました!',
                wallpaperApplied: '新しい壁紙が適用されました。',
                wallpaperReset: '壁紙がリセットされました!',
                confirm: '確認',
                warning: '警告',
                success: '成功'
            }
        };
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        console.log('⚙️ Settings Manager initializing...');

        // Apply saved theme
        this.applyTheme();

        // Update UI text for current language
        this.updateSettingsText();

        // Setup sidebar navigation
        this.setupNavigation();

        // Setup dark mode toggle
        this.setupDarkMode();

        // Setup personalization features
        this.setupWallpaper();
        this.setupAccentColor();
        this.setupOpacity();

        // Setup language toggle
        this.setupLanguageToggle();

        // Setup reset buttons
        this.setupResetButtons();

        // Setup back button
        this.setupBackButton();

        // Setup legal link
        this.setupLegalLink();

        console.log('✅ Settings Manager ready');
    }

    // ===== LOCALIZATION =====
    updateSettingsText() {
        const t = this.locales[this.locale];
        if (!t) return;

        // Update menu items and back button
        this.updateMenuItemTexts();

        // Update headings
        document.querySelectorAll('.content-section').forEach(section => {
            const title = section.querySelector('h1');
            if (title) {
                if (section.id === 'general') title.textContent = t.general;
                else if (section.id === 'personalization') title.textContent = t.personalization;
                else if (section.id === 'about') title.textContent = t.about;
            }
        });

        // Update General section - Language dropdown
        const firstSettingsRow = document.querySelector('#general .settings-row .row-label');
        if (firstSettingsRow) {
            firstSettingsRow.textContent = t.language;
        }

        const deleteRow = document.querySelector('[id="delete-data-row"]');
        if (deleteRow) {
            const label = deleteRow.querySelector('.row-label');
            if (label) label.textContent = t.deleteAllData;
        }

        // Update Personalization section
        const darkModeLabel = document.querySelector('[id="dark-mode-toggle"]')?.parentElement?.querySelector('.row-label');
        if (darkModeLabel) darkModeLabel.textContent = t.darkMode;

        const wallpaperRow = document.querySelector('[id="wallpaper-row"]');
        if (wallpaperRow) {
            const label = wallpaperRow.querySelector('.row-label');
            const btn = wallpaperRow.querySelector('button');
            if (label) label.textContent = t.changeWallpaper;
            if (btn) btn.textContent = t.selectImage;
        }

        const resetBgRow = document.querySelector('[id="reset-bg-row"]');
        if (resetBgRow) {
            const label = resetBgRow.querySelector('.row-label');
            if (label) label.textContent = t.resetWallpaper;
        }

        // Update Accent Color row
        const accentColorLabel = document.querySelector('#accent-color');
        if (accentColorLabel) {
            accentColorLabel.textContent = t.accentColor;
        }

        // Update Container Opacity row
        const opacityTitleRow = document.querySelector('#opacity-title');
        if (opacityTitleRow) {
            const label = opacityTitleRow.querySelector('.row-label');
            if (label) label.textContent = t.containerOpacity;
        }

        const resetSettingsRow = document.querySelector('[id="reset-settings-row"]');
        if (resetSettingsRow) {
            const label = resetSettingsRow.querySelector('.row-label');
            if (label) label.textContent = t.resetSettings;
        }

        // Update About section
        const versionRows = document.querySelectorAll('#about .settings-row');
        if (versionRows[0]) {
            const label = versionRows[0].querySelector('.row-label');
            if (label) label.textContent = t.version;
        }

        const legalRow = document.querySelector('[id="legal-row"]');
        if (legalRow) {
            const label = legalRow.querySelector('.row-label');
            if (label) label.textContent = t.legal;
        }
    }

    // ===== THEME MANAGEMENT =====
    applyTheme() {
        if (this.isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    setupDarkMode() {
        const toggle = document.getElementById('dark-mode-toggle');
        if (!toggle) return;

        toggle.checked = this.isDark;
        toggle.addEventListener('change', (e) => {
            this.isDark = e.target.checked;
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
            this.applyTheme();
        });
    }

    // ===== NAVIGATION =====
    setupNavigation() {
        const menuItems = document.querySelectorAll('.menu-item[data-section]');
        const sections = document.querySelectorAll('.content-section');

        console.log(`Found ${menuItems.length} menu items, ${sections.length} sections`);

        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-section');

                // Hide all sections
                sections.forEach(s => s.classList.remove('active'));

                // Deactivate all menu items
                menuItems.forEach(m => m.classList.remove('active'));

                // Show target section
                const section = document.getElementById(target);
                if (section) {
                    section.classList.add('active');
                    item.classList.add('active');
                    console.log(`✓ Switched to ${target}`);
                } else {
                    console.error(`Section ${target} not found`);
                }
            });
        });

        // Update menu item texts for current language
        this.updateMenuItemTexts();
    }

    updateMenuItemTexts() {
        const t = this.locales[this.locale];
        if (!t) return;

        const menuItems = {
            'general': t.general,
            'personalization': t.personalization,
            'about': t.about
        };

        document.querySelectorAll('.menu-item[data-section]').forEach(item => {
            const section = item.getAttribute('data-section');
            if (menuItems[section]) {
                const icon = item.querySelector('ion-icon');
                item.innerHTML = '';
                if (icon) item.appendChild(icon.cloneNode(true));
                item.appendChild(document.createTextNode(' ' + menuItems[section]));
            }
        });

        // Update back button
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            const icon = backBtn.querySelector('ion-icon');
            backBtn.innerHTML = '';
            if (icon) backBtn.appendChild(icon.cloneNode(true));
            backBtn.appendChild(document.createTextNode(' ' + t.back));
        }
    }

    // ===== LANGUAGE TOGGLE =====
    setupLanguageToggle() {
        // Handle dropdown select in HTML
        const languagesSelect = document.getElementById('languages');
        if (languagesSelect) {
            languagesSelect.value = this.locale;
            languagesSelect.addEventListener('change', async (e) => {
                this.locale = e.target.value;
                localStorage.setItem('locale', this.locale);
                
                // Update text immediately
                this.updateSettingsText();
                
                const t = this.locales[this.locale];
            });
        }

        // Also handle button toggle if it exists
        const btn = document.getElementById('toggle-lang-btn');
        if (!btn) return;

        const langMap = { 
            en: this.locales.en.english, 
            id: this.locales.id.bahasa,
            de: this.locales.de.german,
            jp: this.locales.jp.japanese
        };
        const langOrder = ['en', 'id', 'de', 'jp'];

        btn.textContent = langMap[this.locale];

        btn.addEventListener('click', async () => {
            const currentIndex = langOrder.indexOf(this.locale);
            this.locale = langOrder[(currentIndex + 1) % langOrder.length];
            localStorage.setItem('locale', this.locale);
            
            // Update text immediately without reload
            this.updateSettingsText();
            
            // Update button text
            btn.textContent = langMap[this.locale];
            
            // Update dropdown if it exists
            if (languagesSelect) {
                languagesSelect.value = this.locale;
            }

            const t = this.locales[this.locale];
            const messages = {
                en: 'Language changed to English!',
                id: 'Bahasa berubah ke Indonesia!',
                de: 'Sprache zu Deutsch geändert!',
                jp: '言語が日本語に変わりました!'
            };
        });
    }

    // ===== RESET BUTTONS =====
    setupResetButtons() {
        // Reset Settings
        const resetSettingsRow = document.getElementById('reset-settings-row');
        if (resetSettingsRow) {
            resetSettingsRow.addEventListener('click', async () => {
                const t = this.locales[this.locale];
                const confirmed = await this.showConfirm(t.resetConfirm, t.confirm);
                if (confirmed) {
                    localStorage.removeItem('theme');
                    localStorage.removeItem('accentColor');
                    localStorage.removeItem('containerOpacity');
                    localStorage.removeItem('customBackground');
                    window.location.reload();
                }
            });
        }

        // Delete All Data
        const deleteDataRow = document.getElementById('delete-data-row');
        if (deleteDataRow) {
            deleteDataRow.addEventListener('click', async () => {
                const t = this.locales[this.locale];
                const confirmed = await this.showConfirm(t.deleteConfirm, t.warning);
                if (confirmed) {
                    localStorage.clear();
                    window.location.reload();
                }
            });
        }
    }

    // ===== WALLPAPER MANAGEMENT =====
    setupWallpaper() {
        const wallpaperRow = document.getElementById('wallpaper-row');
        const bgInput = document.getElementById('bg-upload');
        const resetBgRow = document.getElementById('reset-bg-row');

        if (wallpaperRow && bgInput) {
            wallpaperRow.addEventListener('click', () => bgInput.click());
        }

        if (bgInput) {
            bgInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = async (evt) => {
                    localStorage.setItem('customBackground', evt.target.result);
                    const t = this.locales[this.locale];
                };
                reader.readAsDataURL(file);
            });
        }

        if (resetBgRow) {
            resetBgRow.addEventListener('click', async () => {
                const t = this.locales[this.locale];
                localStorage.removeItem('customBackground');
            });
        }
    }

    // ===== ACCENT COLOR MANAGEMENT =====
    setupAccentColor() {
        const accentInput = document.getElementById('accent-color-picker');
        if (!accentInput) return;

        // Load saved accent color
        const savedAccent = localStorage.getItem('accentColor') || '#007aff';
        accentInput.value = savedAccent;

        accentInput.addEventListener('change', (e) => {
            localStorage.setItem('accentColor', e.target.value);
        });
    }

    // ===== OPACITY MANAGEMENT =====
    setupOpacity() {
        const opacitySlider = document.getElementById('opacity-slider');
        const opacityValue = document.getElementById('opacity-value');

        if (!opacitySlider) return;

        // Load saved opacity
        const savedOpacity = localStorage.getItem('containerOpacity') || '1';
        opacitySlider.value = savedOpacity;
        if (opacityValue) {
            opacityValue.textContent = Math.round(parseFloat(savedOpacity) * 100) + '%';
        }

        opacitySlider.addEventListener('input', (e) => {
            localStorage.setItem('containerOpacity', e.target.value);
            if (opacityValue) {
                opacityValue.textContent = Math.round(parseFloat(e.target.value) * 100) + '%';
            }
        });
    }

    // ===== BACK BUTTON =====
    setupBackButton() {
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    }

    // ===== LEGAL LINK =====
    setupLegalLink() {
        const legalRow = document.getElementById('legal-row');
        if (legalRow) {
            legalRow.addEventListener('click', () => {
                window.location.href = 'license.html';
            });
        }
    }

    // ===== TAURI DIALOGS =====
    async showMessage(message, title = 'Info') {
        try {
            const { message: tauriMessage } = window.__TAURI__.dialog;
            await tauriMessage(message, { title });
        } catch (err) {
            console.warn('Tauri not available, using alert', err);
            alert(message);
        }
    }

    async showConfirm(message, title = 'Confirm') {
        try {
            const { ask } = window.__TAURI__.dialog;
            return await ask(message, { title });
        } catch (err) {
            console.warn('Tauri not available, using confirm', err);
            return confirm(message);
        }
    }
}

// ===== INITIALIZE =====
const settingsManager = new SettingsManager();