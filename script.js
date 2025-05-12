// Import translations
import translations from './translations.js';

// Добавляем перевод для новой кнопки "Настройки"
if (!translations.ru.settings) {
    translations.ru.settings = 'Настройки';
    translations.en.settings = 'Settings';
    translations.es.settings = 'Ajustes';
    translations.fr.settings = 'Paramètres';
    translations.de.settings = 'Einstellungen';
}

if (!translations.ru.language) {
    translations.ru.language = 'Язык';
    translations.en.language = 'Language';
    translations.es.language = 'Idioma';
    translations.fr.language = 'Langue';
    translations.de.language = 'Sprache';
}

// Storage Configuration
const STORAGE_KEY = 'teleprompterSettings';

// Current language
let currentLang = 'ru';

// Helper functions for local storage
function saveSettings() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            text: textEl.textContent,
            font: +fontRange.value,
            speed: +speedRange.value,
            bold: boldToggle.checked,
            mirror: mirrorState,
            language: currentLang
        }));
    } catch (e) {
        // Silent fail if localStorage isn't available
    }
}

function loadSettings() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
        return {};
    }
}

// Get saved settings or use defaults
let settings = loadSettings();

// State variables
let speedLines = settings.speed || 1,
    running = false,
    last = null,
    offset = 0,
    mirrorState = settings.mirror || 0;

// DOM Elements
const prompter = document.getElementById('prompter'),
    wrapper = document.getElementById('wrapper'),
    textEl = document.getElementById('text');

const speedRange = document.getElementById('speedRange'),
    fontRange = document.getElementById('fontRange'),
    speedVal = document.getElementById('speedVal'),
    fontVal = document.getElementById('fontVal');

const boldToggle = document.getElementById('boldToggle'),
    mirrorHToggle = document.getElementById('mirrorHToggle'),
    mirrorVToggle = document.getElementById('mirrorVToggle');

const startStopBtn = document.getElementById('startStopBtn'),
    resetBtn = document.getElementById('resetBtn'),
    fsBtn = document.getElementById('fsBtn');

const hideBtn = document.getElementById('hideBtn'),
    menuToggleBtn = document.getElementById('menuToggle'),
    controls = document.getElementById('controls');

// Helper calculations
const scrollDir = () => (mirrorState & 2) ? 1 : -1;
const lineHeight = () => +fontRange.value;

// UI Functions
function applyMirror() {
    const sx = (mirrorState & 1) ? -1 : 1,
        sy = (mirrorState & 2) ? -1 : 1;
    textEl.style.transform = `scale(${sx}, ${sy})`;
}

function applyOffset() {
    wrapper.style.transform = `translateY(${offset}px)`;
}

function resetScroll() {
    offset = (scrollDir() === -1) ? prompter.clientHeight : -textEl.clientHeight;
    applyOffset();
}

// Animation Functions
function step(ts) {
    if (!running) {
        last = null;
        return;
    }

    if (!last) last = ts;

    const dt = (ts - last) / 1000;
    last = ts;

    offset += scrollDir() * speedLines * lineHeight() * dt;
    applyOffset();

    // Reset when text scrolls off screen
    if (scrollDir() === -1 && offset < -textEl.clientHeight) resetScroll();
    if (scrollDir() === 1 && offset > prompter.clientHeight) resetScroll();

    requestAnimationFrame(step);
}

// Control Functions
function toggleRun() {
    running = !running;
    startStopBtn.textContent = running
        ? translations[currentLang].stop
        : translations[currentLang].start;
    if (running) requestAnimationFrame(step);
}

function setBold(v) {
    textEl.style.fontWeight = v ? 'bold' : 'normal';
    boldToggle.checked = v;
    saveSettings();
}

function cycleMirror() {
    mirrorState = (mirrorState + 1) & 3;
    mirrorHToggle.checked = !!(mirrorState & 1);
    mirrorVToggle.checked = !!(mirrorState & 2);
    applyMirror();
    resetScroll();
    saveSettings();
}

// Функция для открытия/закрытия бокового меню
function toggleSidebar() {
    const isOpen = controls.classList.toggle('open');
    menuToggleBtn.classList.toggle('hidden', isOpen);
}

function toggleFS() {
    const doc = document;
    if (!doc.fullscreenElement && !(doc.webkitFullscreenElement)) {
        (doc.documentElement.requestFullscreen || doc.documentElement.webkitRequestFullscreen).call(doc.documentElement);
    } else {
        (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
    }
}

// i18n Function
function applyLanguage(lang) {
    if (!translations[lang]) return;

    // Set language
    currentLang = lang;

    // Update HTML lang attribute
    document.getElementById('html-root').setAttribute('lang', lang);

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Update button text (special case for start/stop)
    if (startStopBtn) {
        startStopBtn.textContent = running
            ? translations[lang].stop
            : translations[lang].start;
    }

    // Save selected language
    saveSettings();
}

// Initialize UI with persisted settings
if (settings.font) {
    fontRange.value = settings.font;
    fontVal.textContent = settings.font;
    textEl.style.fontSize = settings.font + 'px';
}

if (settings.bold === false) {
    boldToggle.checked = false;
    setBold(false);
}

speedRange.value = speedLines;
speedVal.textContent = speedLines;
applyMirror();

if (settings.text) {
    textEl.textContent = settings.text;
}

// Apply saved language or default
if (settings.language && translations[settings.language]) {
    currentLang = settings.language;
    document.getElementById('langSelect').value = currentLang;
}

// Initialize language
applyLanguage(currentLang);

// Event Bindings
speedRange.oninput = () => {
    speedLines = +speedRange.value;
    speedVal.textContent = speedLines;
    saveSettings();
};

fontRange.oninput = () => {
    textEl.style.fontSize = fontRange.value + 'px';
    fontVal.textContent = fontRange.value;
    resetScroll();
    saveSettings();
};

boldToggle.onchange = () => setBold(boldToggle.checked);

mirrorHToggle.onchange = () => {
    mirrorState = (mirrorState & 2) | (mirrorHToggle.checked ? 1 : 0);
    applyMirror();
    resetScroll();
    saveSettings();
};

mirrorVToggle.onchange = () => {
    mirrorState = (mirrorState & 1) | (mirrorVToggle.checked ? 2 : 0);
    applyMirror();
    resetScroll();
    saveSettings();
};

// Обработчики для нового бокового меню
menuToggleBtn.onclick = toggleSidebar;
hideBtn.onclick = toggleSidebar;

startStopBtn.onclick = toggleRun;
resetBtn.onclick = resetScroll;
fsBtn.onclick = toggleFS;

// File Upload Handling
document.getElementById('fileInput').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;

    const r = new FileReader();
    r.onload = () => {
        textEl.textContent = r.result;
        resetScroll();
        saveSettings();
    };
    r.readAsText(f, 'utf-8');
});

// Keyboard Control System
const repeatKeys = new Set(['ArrowUp', 'ArrowDown']);
let accelTimer = null, accelFactor = 1;

function handleAccel(code) {
    if (!repeatKeys.has(code)) return;

    accelTimer && clearTimeout(accelTimer);
    accelFactor = 1;

    accelTimer = setInterval(() => {
        accelFactor = Math.min(accelFactor + 0.2, 5);

        if (code === 'ArrowUp') {
            offset -= lineHeight() * accelFactor;
        } else {
            offset += lineHeight() * accelFactor;
        }

        applyOffset();
    }, 200);
}

function stopAccel() {
    accelTimer && clearInterval(accelTimer);
    accelFactor = 1;
    accelTimer = null;
}

// Key Event Listeners
document.addEventListener('keydown', e => {
    if (e.repeat && repeatKeys.has(e.code)) return;

    switch (e.code) {
        case 'KeyH':
            e.preventDefault(); // Предотвращаем действие браузера по умолчанию
            toggleSidebar();
            break;
        case 'Space':
            e.preventDefault(); // Предотвращаем прокрутку страницы при нажатии пробела
            toggleRun();
            break;
        case 'KeyF':
            e.preventDefault(); // Предотвращаем активацию поиска в Firefox
            toggleFS();
            break;
        case 'ArrowRight':
            e.preventDefault(); // Предотвращаем прокрутку страницы
            speedRange.value = Math.min(+speedRange.value + 0.1, speedRange.max);
            speedRange.oninput();
            break;
        case 'ArrowLeft':
            e.preventDefault(); // Предотвращаем прокрутку страницы
            speedRange.value = Math.max(+speedRange.value - 0.1, speedRange.min);
            speedRange.oninput();
            break;
        case 'ArrowUp':
            e.preventDefault(); // Предотвращаем прокрутку страницы
            offset -= lineHeight();
            applyOffset();
            handleAccel('ArrowUp');
            break;
        case 'ArrowDown':
            e.preventDefault(); // Предотвращаем прокрутку страницы
            offset += lineHeight();
            applyOffset();
            handleAccel('ArrowDown');
            break;
        case 'Equal':
        case 'NumpadAdd':
            e.preventDefault(); // Предотвращаем изменение масштаба в браузере
            fontRange.value = Math.min(+fontRange.value + 5, fontRange.max);
            fontRange.oninput();
            break;
        case 'Minus':
        case 'NumpadSubtract':
            e.preventDefault(); // Предотвращаем изменение масштаба в браузере
            fontRange.value = Math.max(+fontRange.value - 5, fontRange.min);
            fontRange.oninput();
            break;
        case 'Tab':
            e.preventDefault(); // Уже было, сохраняем
            cycleMirror();
            break;
        case 'Enter':
            e.preventDefault(); // Предотвращаем действие по умолчанию
            resetScroll();
            break;
        case 'Slash': // Перехватываем слэш для предотвращения запуска поиска
            e.preventDefault();
            break;
    }
});

document.addEventListener('keyup', stopAccel);

// Language selector event
document.getElementById('langSelect').addEventListener('change', (e) => {
    applyLanguage(e.target.value);
});

// Global focus handling to ensure hotkeys work
document.body.addEventListener('click', () => {
    document.body.focus();
});

// Ensure focus on page load
window.addEventListener('load', () => {
    document.body.focus();
    resetScroll();
});

window.addEventListener('resize', resetScroll);