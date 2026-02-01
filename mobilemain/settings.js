document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggleBtn = document.getElementById('theme-toggle');
    const uploadBgBtn = document.getElementById('upload-bg-btn');
    const fileInput = document.getElementById('bg-upload');
    const resetBgBtn = document.getElementById('reset-bg-btn');
    const langToggleBtn = document.getElementById('lang-toggle');
    const changeAccentBtn = document.getElementById('change-accent-btn');
    const accentColorPicker = document.getElementById('accent-color-picker');
    const opacitySlider = document.getElementById('opacity-slider');

    // Localization Strings
    const locales = {
        en: {
            settingsTitle: "Settings",
            back: "Back",
            themesHeading: "Themes/Personalization",
            languageSection: "Language",
            display: "Display",
            themeHint: "Change the app's theme.",
            themeBtn: "Toggle Theme (Light/Dark)",
            accentHeading: "Accent Color",
            accentHint: "Change the main color of buttons and controls.",
            changeColorBtn: "Change Color",
            opacityHeading: "Element Opacity",
            opacityHint: "Adjust the transparency of elements.",
            wallpaper: "Wallpaper",
            wallpaperHint: "You can set a custom photo from your device as wallpaper.",
            selectPic: "Select Picture...",
            resetBg: "Reset Background",
            language: "Language",
            languageHint: "Change the app's language.",
            langBtn: "Change Language",
            aboutSection: "About",
            aboutTitle: "About and Credits",
            aboutApp: "FractionCalc for Android, v2.0.1",
            aboutMade: "Made by Ashyraffa and Ratu",
            dangerZones: "Danger Zones",
            resetHint: "Reset all settings to default values.",
            resetHeading: "Reset Settings",
            resetBtn: "Reset Settings",
        },
        id: {
            settingsTitle: "Pengaturan",
            back: "Kembali",
            themesHeading: "Tema/Personalisasi",
            languageSection: "Bahasa",
            display: "Tampilan",
            themeHint: "Ganti tema aplikasi.",
            themeBtn: "Ganti Tema (Terang/Gelap)",
            accentHeading: "Warna Aksen",
            accentHint: "Ubah warna utama tombol dan kontrol.",
            changeColorBtn: "Ubah Warna",
            opacityHeading: "Opasitas Elemen",
            opacityHint: "Sesuaikan transparansi elemen.",
            wallpaper: "Latar",
            wallpaperHint: "Anda dapat mengatur foto dari perangkat sebagai latar.",
            selectPic: "Pilih Gambar...",
            resetBg: "Reset Latar",
            language: "Bahasa",
            languageHint: "Ganti bahasa aplikasi.",
            langBtn: "Ganti Bahasa",
            aboutSection: "Tentang",
            aboutTitle: "Tentang dan Kredit",
            aboutApp: "FractionCalc untuk Android, v2.0.1",
            aboutMade: "Dibuat oleh Ashyraffa dan Ratu",
            dangerZones: "Zona Bahaya",
            resetHint: "Atur ulang semua pengaturan ke nilai default.",
            resetHeading: "Atur Ulang Pengaturan",
            resetBtn: "Atur Ulang"
        }
    };

    // --- Core Functions ---
    function applyTheme(theme) {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    function applyAccentColor(color) {
        if (!color) return;
        document.documentElement.style.setProperty('--accent', color);
        // Simple darker color for hover/active state
        const accent2 = pSBC(-0.2, color);
        if (accent2) {
            document.documentElement.style.setProperty('--accent-2', accent2);
        }
    }

    function applyOpacity(value) {
        document.documentElement.style.setProperty('--surface-opacity', value);
    }
    
    function applyBackground(bg) {
        document.body.style.backgroundImage = bg ? `url('${bg}')` : '';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }

    function applyLocale() {
        const lang = localStorage.getItem('locale') || 'en';
        const t = locales[lang] || locales.en;
        // Set document title (if provided)
        if (t.settingsTitle) document.title = t.settingsTitle;

        // Apply translations declared via data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = t[key];
            if (typeof text === 'undefined') return;
            const attr = el.getAttribute('data-i18n-attr');
            if (attr) {
                el.setAttribute(attr, text);
            } else {
                el.innerText = text;
            }
        });
    }

    // --- Event Listeners ---
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            const newTheme = isDark ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }
    
    if (changeAccentBtn) {
        changeAccentBtn.addEventListener('click', () => accentColorPicker.click());
    }

    if(accentColorPicker) {
        accentColorPicker.addEventListener('input', (e) => {
            const newColor = e.target.value;
            localStorage.setItem('accentColor', newColor);
            applyAccentColor(newColor);
        });
    }

    if (opacitySlider) {
        opacitySlider.addEventListener('input', (e) => {
            const newOpacity = e.target.value;
            localStorage.setItem('opacity', newOpacity);
            applyOpacity(newOpacity);
        });
    }
    
    if (uploadBgBtn) {
        uploadBgBtn.addEventListener('click', () => fileInput.click());
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                const dataURL = evt.target.result;
                localStorage.setItem('customBackground', dataURL);
                applyBackground(dataURL);
            };
            reader.readAsDataURL(file);
        });
    }

    if (resetBgBtn) {
        resetBgBtn.addEventListener('click', () => {
            localStorage.removeItem('customBackground');
            applyBackground(null);
        });
    }

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const currentLang = localStorage.getItem('locale') || 'en';
            const newLang = currentLang === 'en' ? 'id' : 'en';
            localStorage.setItem('locale', newLang);
            applyLocale();
        });
    }

    // --- Initial Load ---
    applyTheme(localStorage.getItem('theme') || 'light');
    applyAccentColor(localStorage.getItem('accentColor'));
    
    const savedOpacity = localStorage.getItem('opacity') || '1';
    opacitySlider.value = savedOpacity;
    applyOpacity(savedOpacity);
    
    applyBackground(localStorage.getItem('customBackground'));
    applyLocale();
});

// pSBC Function to darken/lighten colors (for hover states)
const pSBC=(p,c0,c1,l)=>{let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;let pSBCr=(d)=>{let n=d.length,x={};if(n>9){[r,g,b,a]=d=d.split(","),n=d.length;if(n<3||n>4)return null;x.r=i(r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1}else{if(n==8||n==6||n<4)return null;if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");d=i(d.slice(1),16);if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1}return x};h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=pSBCr(c0),P=p<0,t=c1&&c1!="c"?pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;if(!f||!t)return null;if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)};