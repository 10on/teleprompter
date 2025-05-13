// Основной модуль телепромптера
import translations from './translations.js';
import { loadSettings, saveSettings, applyLanguage, detectBrowserLanguage } from './storage.js';
import { createAnimationManager } from './animation.js';
import { createControlsManager } from './controls.js';
import createVAD from './vad.js';

// Загружаем сохраненные настройки или используем значения по умолчанию
const settings = loadSettings();

// Состояние приложения
const state = {
    speedLines: settings.speed || 1,
    running: false,
    offset: 0,
    mirrorState: settings.mirror || 0,
    currentLang: settings.language || detectBrowserLanguage()
};

// DOM-элементы
const elements = {
    // Основные элементы
    prompter: document.getElementById('prompter'),
    wrapper: document.getElementById('wrapper'),
    textEl: document.getElementById('text'),

    // Элементы управления
    speedRange: document.getElementById('speedRange'),
    fontRange: document.getElementById('fontRange'),
    speedVal: document.getElementById('speedVal'),
    fontVal: document.getElementById('fontVal'),
    boldToggle: document.getElementById('boldToggle'),
    mirrorHToggle: document.getElementById('mirrorHToggle'),
    mirrorVToggle: document.getElementById('mirrorVToggle'),
    startStopBtn: document.getElementById('startStopBtn'),
    resetBtn: document.getElementById('resetBtn'),
    fsBtn: document.getElementById('fsBtn'),
    hideBtn: document.getElementById('hideBtn'),
    menuToggleBtn: document.getElementById('menuToggle'),
    controls: document.getElementById('controls'),
    fileInput: document.getElementById('fileInput'),
    langSelect: document.getElementById('langSelect'),

    // Кнопки выравнивания текста
    alignLeftBtn: document.getElementById('alignLeft'),
    alignCenterBtn: document.getElementById('alignCenter'),
    alignRightBtn: document.getElementById('alignRight')
};

// Создаем менеджер анимации
const animationManager = createAnimationManager(elements, state);

// Создаем менеджер элементов управления
const controlsManager = createControlsManager(elements, state, animationManager);

// Инициализация пользовательского интерфейса с сохраненными настройками
function initializeUI() {
    if (settings.font) {
        elements.fontRange.value = settings.font;
        elements.fontVal.textContent = settings.font;
        elements.textEl.style.fontSize = settings.font + 'px';
    }

    if (settings.bold === false) {
        elements.boldToggle.checked = false;
        controlsManager.setBold(false);
    }

    // Применяем сохраненное выравнивание текста или используем центр по умолчанию
    if (settings.textAlign) {
        controlsManager.setTextAlign(settings.textAlign);
    } else {
        controlsManager.setTextAlign('center');
    }

    elements.speedRange.value = state.speedLines;
    elements.speedVal.textContent = state.speedLines;
    controlsManager.applyMirror();

    if (settings.text) {
        elements.textEl.textContent = settings.text;
    }

    // Устанавливаем значение селектора языка
    elements.langSelect.value = state.currentLang;

    // Инициализируем язык
    applyLanguage(state.currentLang, elements, state.running);
}

// Привязка обработчиков событий
function bindEventListeners() {
    // Обработчики скорости и размера шрифта
    elements.speedRange.addEventListener('input', controlsManager.handleSpeedChange);
    elements.fontRange.addEventListener('input', controlsManager.handleFontChange);

    // Обработчики переключателей
    elements.boldToggle.addEventListener('change', controlsManager.handleBoldChange);
    elements.mirrorHToggle.addEventListener('change', controlsManager.handleMirrorHChange);
    elements.mirrorVToggle.addEventListener('change', controlsManager.handleMirrorVChange);

    // Обработчики бокового меню
    elements.menuToggleBtn.addEventListener('click', controlsManager.toggleSidebar);
    elements.hideBtn.addEventListener('click', controlsManager.toggleSidebar);

    // Обработчики выравнивания текста
    elements.alignLeftBtn.addEventListener('click', () => controlsManager.setTextAlign('left'));
    elements.alignCenterBtn.addEventListener('click', () => controlsManager.setTextAlign('center'));
    elements.alignRightBtn.addEventListener('click', () => controlsManager.setTextAlign('right'));

    // Обработчики кнопок управления
    elements.startStopBtn.addEventListener('click', () => animationManager.toggleRun(translations, state.currentLang));
    elements.resetBtn.addEventListener('click', animationManager.resetScroll);
    elements.fsBtn.addEventListener('click', controlsManager.toggleFS);

    // Обработчик загрузки файла
    elements.fileInput.addEventListener('change', controlsManager.handleFileUpload);

    // Обработчики клавиатуры
    document.addEventListener('keydown', controlsManager.handleKeyDown);
    document.addEventListener('keyup', controlsManager.stopAccel);

    // Обработчик выбора языка
    elements.langSelect.addEventListener('change', (e) => {
        state.currentLang = e.target.value;
        applyLanguage(state.currentLang, elements, state.running);

        // Сохраняем настройки
        const settings = controlsManager.createSettingsSnapshot();
        saveSettings(settings);
    });

    // Глобальная обработка фокуса для работы горячих клавиш
    document.body.addEventListener('click', () => {
        document.body.focus();
    });

    // Обработчик изменения размера окна
    window.addEventListener('resize', animationManager.resetScroll);
}

// Инициализация приложения
function initApp() {
    initializeUI();
    bindEventListeners();

    // Устанавливаем фокус и сбрасываем прокрутку при загрузке страницы
    document.body.focus();
    animationManager.resetScroll();
}

function setupVoiceControl() {
    const checkbox = document.getElementById('voiceControlToggle');
    if (!checkbox) return;

    let stream, vad;

    checkbox.addEventListener('change', async () => {
        if (checkbox.checked) {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const ctx = new AudioContext();

                vad = createVAD(ctx, stream, {
                    bufferLen: 512,        // меньше буфер → чаще обновления
                    fftSize: 512,
                    smoothingTimeConstant: 0.1,
                    noiseCaptureDuration: 500,
                    activityCounterThresh: 2,  // реакция ≈ 2×512/48k ≈ 22 мс
                    onVoiceStart() {
                        if (!state.running) animationManager.toggleRun(translations, state.currentLang);
                    },
                    onVoiceStop() {
                        if (state.running) animationManager.toggleRun(translations, state.currentLang);
                    }
                });
            } catch (e) {
                console.error('VAD error', e);
                checkbox.checked = false;
            }
        } else {
            vad?.destroy();
            stream?.getTracks().forEach(t => t.stop());
        }
    });
}

window.addEventListener('load', () => {
    initApp();
    setupVoiceControl(); // ← подключаем при загрузке
});