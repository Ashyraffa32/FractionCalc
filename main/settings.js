   // --- Localization Data for Settings ---
        const settingsLocales = {
            en: {
                backToApp: "Back to App",
                settings: "Settings",
                general: "General",
                personalization: "Personalization",
                about: "About",
                systemLanguage: "System Language",
                english: "English",
                indonesian: "Bahasa Indonesia",
                deleteAllData: "Delete All User Data",
                darkMode: "Dark Mode",
                changeWallpaper: "Change Wallpaper",
                selectImage: "Select Image",
                resetWallpaper: "Reset Wallpaper",
                accentColor: "Accent Color",
                containerOpacity: "Container Opacity",
                resetSettings: "Reset Settings to Default",
                version: "Version",
                developer: "Developer",
                developers: "Ashyraffa & Ratu",
                copyright: "© 2026 FractionCalc.",
                legal: "Legal",
            },
            id: {
                backToApp: "Kembali ke Aplikasi",
                settings: "Pengaturan",
                general: "Umum",
                personalization: "Personalisasi",
                about: "Tentang",
                systemLanguage: "Bahasa Sistem",
                english: "English",
                indonesian: "Bahasa Indonesia",
                deleteAllData: "Hapus Semua Data Pengguna",
                darkMode: "Mode Gelap",
                changeWallpaper: "Ganti Wallpaper",
                selectImage: "Pilih Gambar",
                resetWallpaper: "Reset Wallpaper",
                accentColor: "Warna Aksen",
                containerOpacity: "Opasitas Kontainer",
                resetSettings: "Reset Pengaturan ke Default",
                version: "Versi",
                developer: "Pengembang",
                developers: "Ashyraffa & Ratu",
                copyright: "© 2026 FractionCalc.",
                legal: "Legal"
            }
        };

        // --- Function to Update Settings Text ---
 // --- Function to Update Settings Text (Fixed Version) ---
function updateSettingsText() {
    const lang = localStorage.getItem('locale') || 'en';
    const t = settingsLocales[lang];
    if (!t) return;

    // --- Sidebar ---
    document.querySelector('.back-link').innerHTML = `<ion-icon name="chevron-back"></ion-icon> ${t.backToApp}`;
    document.querySelector('.sidebar-header h2').innerText = t.settings;
    document.querySelector('.menu-item[data-target="general"] .menu-text').innerText = t.general;
    document.querySelector('.menu-item[data-target="display"] .menu-text').innerText = t.personalization;
    document.querySelector('.menu-item[data-target="about"] .menu-text').innerText = t.about;

    // --- General Section ---
    document.querySelector('#general .content-title').innerText = t.general;
    document.getElementById('lbl-sys-lang').innerText = t.systemLanguage;
    document.getElementById('lbl-delete-data').innerText = t.deleteAllData;
    
    // Update the language display text (English/Indonesia)
    const langText = document.getElementById('current-lang-text');
    if (lang === 'id') {
        langText.innerText = settingsLocales.id.indonesian;
    } else {
        langText.innerText = settingsLocales.en.english;
    }

    // --- Personalization Section ---
    document.querySelector('#display .content-title').innerText = t.personalization;
    document.getElementById('lbl-dark-mode').innerText = t.darkMode;
    document.getElementById('lbl-wallpaper').innerText = t.changeWallpaper;
    document.getElementById('txt-select-img').innerText = t.selectImage;
    document.getElementById('lbl-reset-bg').innerText = t.resetWallpaper;
    document.getElementById('lbl-accent').innerText = t.accentColor;
    
    // This is the line that was crashing before - fixed now with ID
    const opacityLabel = document.getElementById('lbl-opacity') || document.getElementById('opacity-row');
    if(opacityLabel) opacityLabel.innerText = t.containerOpacity;

    document.getElementById('lbl-reset-settings').innerText = t.resetSettings;

    // --- About Section ---
    document.querySelector('#about .content-title').innerText = t.about;
    document.getElementById('lbl-version').innerText = t.version;
    // Note: 'developer' ID was already in your original HTML
    const devLabel = document.querySelector('#about .settings-row:nth-child(2) .row-label'); 
    if(devLabel) devLabel.innerText = t.developer; 
    
    document.querySelector('#about .settings-row:nth-child(2) .row-value').innerText = t.developers;
    document.getElementById('lbl-legal').innerText = t.legal;
    document.querySelector('#about p').innerText = t.copyright;
}

        // --- 1. Navigation Logic ---
        const menuItems = document.querySelectorAll('.menu-item');
        const sections = document.querySelectorAll('.content-section');

        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuItems.forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                const targetId = item.getAttribute('data-target');
                sections.forEach(section => section.classList.remove('active-section'));
                const targetSection = document.getElementById(targetId);
                if (targetSection) targetSection.classList.add('active-section');
            });
        });

        // --- 2. Personalization Logic ---
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const wallpaperRow = document.getElementById('wallpaper-row');
        const bgInput = document.getElementById('bg-upload');
        const resetBgBtn = document.getElementById('reset-bg-btn');
        const accentRow = document.getElementById('accent-row');
        const accentInput = document.getElementById('accent-color-picker');
        const accentPreview = document.getElementById('accent-preview');
        const opacitySlider = document.getElementById('opacity-slider');
        const langRow = document.getElementById('lang-row');
        const langText = document.getElementById('current-lang-text');
        const resetSettingsBtn = document.getElementById('reset-settings-btn');

        // Helper: Apply Theme to *This* Page (so settings look like the app)
        function syncVisuals() {
            // Theme
            const isDark = localStorage.getItem('theme') === 'dark';
            document.body.classList.toggle('dark-mode-active', isDark);
            darkModeToggle.checked = isDark;

            // Accent Color
            const storedAccent = localStorage.getItem('accentColor') || '#007aff';
            document.documentElement.style.setProperty('--accent-blue', storedAccent);
            accentPreview.style.backgroundColor = storedAccent;

            // Opacity Slider
            const storedOpacity = localStorage.getItem('containerOpacity') || 1;
            opacitySlider.value = storedOpacity;
            
            // Language Text
            const lang = localStorage.getItem('locale') || 'en';
            langText.innerText = settingsLocales[lang].english; // Default to English label, but actually set based on current
            if (lang === 'id') langText.innerText = settingsLocales[lang].indonesian;
        }

        // --- Event Listeners ---

        // Dark Mode
        darkModeToggle.addEventListener('change', (e) => {
            localStorage.setItem('theme', e.target.checked ? 'dark' : 'light');
            syncVisuals();
        });

        // Wallpaper
        wallpaperRow.addEventListener('click', () => bgInput.click());
        bgInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                localStorage.setItem('customBackground', evt.target.result);
                alert("Wallpaper updated! Go back to the app to see it.");
            };
            reader.readAsDataURL(file);
        });

        resetBgBtn.addEventListener('click', () => {
            localStorage.removeItem('customBackground');
            alert("Wallpaper reset.");
        });

        // Accent Color
        accentRow.addEventListener('click', () => accentInput.click());
        accentInput.addEventListener('change', (e) => {
            localStorage.setItem('accentColor', e.target.value);
            syncVisuals();
        });

        // Opacity
        opacitySlider.addEventListener('input', (e) => {
            localStorage.setItem('containerOpacity', e.target.value);
        });

        // Language
        langRow.addEventListener('click', () => {
            const current = localStorage.getItem('locale') || 'en';
            const next = current === 'en' ? 'id' : 'en';
            localStorage.setItem('locale', next);
            syncVisuals();
            updateSettingsText(); // Update text after language change
        });

        // Reset All
        resetSettingsBtn.addEventListener('click', () => {
            if(confirm("Reset all personalization settings?")) {
                localStorage.removeItem('theme');
                localStorage.removeItem('customBackground');
                localStorage.removeItem('accentColor');
                localStorage.removeItem('containerOpacity');
                localStorage.removeItem('locale');
                syncVisuals();
                alert("Settings reset.");
            }
        });

        // Init on load
        syncVisuals();
        updateSettingsText(); // Initial text update
