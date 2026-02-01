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
                bahasa: 'Bahasa Indonesia'
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
                bahasa: 'Bahasa Indonesia'
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

        // Update headings
        document.querySelectorAll('.content-section').forEach(section => {
            const title = section.querySelector('h1');
            if (title) {
                if (section.id === 'general') title.textContent = t.general;
                else if (section.id === 'personalization') title.textContent = t.personalization;
                else if (section.id === 'about') title.textContent = t.about;
            }
        });

        // Update General section
        const langRow = document.querySelector('[id="toggle-lang-btn"]');
        if (langRow) {
            const label = langRow.parentElement.querySelector('.row-label');
            if (label) label.textContent = t.language;
            langRow.textContent = this.locale === 'en' ? t.english : t.bahasa;
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

        // Find accent color row
        const accentRows = document.querySelectorAll('.settings-row');
        accentRows.forEach(row => {
            const label = row.querySelector('.row-label');
            if (label && label.textContent.includes('Color')) {
                label.textContent = t.accentColor;
            }
            if (label && label.textContent.includes('Opacity')) {
                label.textContent = t.containerOpacity;
            }
        });

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
    }

    // ===== LANGUAGE TOGGLE =====
    setupLanguageToggle() {
        const btn = document.getElementById('toggle-lang-btn');
        if (!btn) return;

        const langMap = { en: this.locales.en.english, id: this.locales.id.bahasa };
        btn.textContent = langMap[this.locale];

        btn.addEventListener('click', async () => {
            this.locale = this.locale === 'en' ? 'id' : 'en';
            localStorage.setItem('locale', this.locale);
            
            // Update text immediately without reload
            this.updateSettingsText();
            
            // Update button text
            btn.textContent = langMap[this.locale];

            const t = this.locales[this.locale];
            await this.showMessage(this.locale === 'en' ? 'Language changed to English!' : 'Bahasa berubah ke Indonesia!', 'Language');
        });
    }

    // ===== RESET BUTTONS =====
    setupResetButtons() {
        // Reset Settings
        const resetSettingsRow = document.getElementById('reset-settings-row');
        if (resetSettingsRow) {
            resetSettingsRow.addEventListener('click', async () => {
                const t = this.locales[this.locale];
                const confirmed = await this.showConfirm(
                    this.locale === 'en' ? 'Reset personalization settings?' : 'Reset pengaturan personalisasi?',
                    'Confirm'
                );
                if (confirmed) {
                    localStorage.removeItem('theme');
                    localStorage.removeItem('accentColor');
                    localStorage.removeItem('containerOpacity');
                    localStorage.removeItem('customBackground');
                    await this.showMessage(
                        this.locale === 'en' ? 'Settings reset!' : 'Pengaturan direset!',
                        'Success'
                    );
                    window.location.reload();
                }
            });
        }

        // Delete All Data
        const deleteDataRow = document.getElementById('delete-data-row');
        if (deleteDataRow) {
            deleteDataRow.addEventListener('click', async () => {
                const confirmed = await this.showConfirm(
                    this.locale === 'en' 
                        ? 'Delete ALL data? This cannot be undone!' 
                        : 'Hapus SEMUA data? Ini tidak dapat dibatalkan!',
                    'WARNING'
                );
                if (confirmed) {
                    localStorage.clear();
                    await this.showMessage(
                        this.locale === 'en' ? 'All data deleted!' : 'Semua data dihapus!',
                        'Success'
                    );
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
                    await this.showMessage(
                        this.locale === 'en' ? 'New wallpaper applied.' : 'Wallpaper baru diterapkan.',
                        'Success'
                    );
                };
                reader.readAsDataURL(file);
            });
        }

        if (resetBgRow) {
            resetBgRow.addEventListener('click', async () => {
                localStorage.removeItem('customBackground');
                await this.showMessage(
                    this.locale === 'en' ? 'Wallpaper reset!' : 'Wallpaper direset!',
                    'Success'
                );
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