// Модуль управления элементами интерфейса телепромптера
import translations from './translations.js';
import { saveSettings } from './storage.js';

export function createControlsManager(elements, state, animationManager) {
    // Функция для применения зеркального отображения текста
    function applyMirror() {
        const sx = (state.mirrorState & 1) ? -1 : 1,
            sy = (state.mirrorState & 2) ? -1 : 1;
        elements.textEl.style.transform = `scale(${sx}, ${sy})`;
    }

    // Функция для установки жирного шрифта
    function setBold(v) {
        elements.textEl.style.fontWeight = v ? 'bold' : 'normal';
        elements.boldToggle.checked = v;

        // Сохраняем настройки
        const settings = createSettingsSnapshot();
        saveSettings(settings);
    }

    // Функция для циклического переключения зеркал
    function cycleMirror() {
        animationManager.preserveScrollPosition(() => {
            state.mirrorState = (state.mirrorState + 1) & 3;
            elements.mirrorHToggle.checked = !!(state.mirrorState & 1);
            elements.mirrorVToggle.checked = !!(state.mirrorState & 2);
            applyMirror();
        });

        // Сохраняем настройки
        const settings = createSettingsSnapshot();
        saveSettings(settings);
    }

    // Функция для открытия/закрытия бокового меню
    function toggleSidebar() {
        const isOpen = elements.controls.classList.toggle('open');
        elements.menuToggleBtn.classList.toggle('hidden', isOpen);
    }

    // Функция для переключения полноэкранного режима
    function toggleFS() {
        const doc = document;
        if (!doc.fullscreenElement && !(doc.webkitFullscreenElement)) {
            (doc.documentElement.requestFullscreen || doc.documentElement.webkitRequestFullscreen).call(doc.documentElement);
        } else {
            (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
        }
    }

    // Функция для установки выравнивания текста
    function setTextAlign(alignment) {
        // Обновляем стиль текста
        elements.textEl.style.textAlign = alignment;

        // Обновляем активную кнопку
        elements.alignLeftBtn.classList.toggle('active', alignment === 'left');
        elements.alignCenterBtn.classList.toggle('active', alignment === 'center');
        elements.alignRightBtn.classList.toggle('active', alignment === 'right');

        // Сохраняем настройки
        const settings = createSettingsSnapshot();
        saveSettings(settings);
    }

    // Обработка загрузки файла
    function handleFileUpload(event) {
        const f = event.target.files[0];
        if (!f) return;

        const r = new FileReader();
        r.onload = () => {
            elements.textEl.textContent = r.result;
            // При загрузке нового файла мы сбрасываем на начало, так как это новый контент
            animationManager.resetScroll();

            // Сохраняем настройки
            const settings = createSettingsSnapshot();
            saveSettings(settings);
        };
        r.readAsText(f, 'utf-8');
    }

    // Обработка клавиатурных событий
    const repeatKeys = new Set(['ArrowUp', 'ArrowDown']);
    let accelTimer = null, accelFactor = 1;

    function handleAccel(code) {
        if (!repeatKeys.has(code)) return;

        accelTimer && clearTimeout(accelTimer);
        accelFactor = 1;

        accelTimer = setInterval(() => {
            accelFactor = Math.min(accelFactor + 0.2, 5);

            if (code === 'ArrowUp') {
                state.offset -= animationManager.lineHeight() * accelFactor;
            } else {
                state.offset += animationManager.lineHeight() * accelFactor;
            }

            animationManager.applyOffset();
        }, 200);
    }

    function stopAccel() {
        accelTimer && clearInterval(accelTimer);
        accelFactor = 1;
        accelTimer = null;
    }

    // Обработчик клавиатурных событий
    function handleKeyDown(e) {
        if (e.repeat && repeatKeys.has(e.code)) return;

        switch (e.code) {
            case 'KeyH':
                e.preventDefault(); // Предотвращаем действие браузера по умолчанию
                toggleSidebar();
                break;
            case 'Space':
                e.preventDefault(); // Предотвращаем прокрутку страницы при нажатии пробела
                animationManager.toggleRun(translations, state.currentLang);
                break;
            case 'KeyF':
                e.preventDefault(); // Предотвращаем активацию поиска в Firefox
                toggleFS();
                break;
            case 'ArrowRight':
                e.preventDefault(); // Предотвращаем прокрутку страницы
                elements.speedRange.value = Math.min(+elements.speedRange.value + 0.1, elements.speedRange.max);
                handleSpeedChange();
                break;
            case 'ArrowLeft':
                e.preventDefault(); // Предотвращаем прокрутку страницы
                elements.speedRange.value = Math.max(+elements.speedRange.value - 0.1, elements.speedRange.min);
                handleSpeedChange();
                break;
            case 'ArrowUp':
                e.preventDefault(); // Предотвращаем прокрутку страницы
                state.offset -= animationManager.lineHeight();
                animationManager.applyOffset();
                handleAccel('ArrowUp');
                break;
            case 'ArrowDown':
                e.preventDefault(); // Предотвращаем прокрутку страницы
                state.offset += animationManager.lineHeight();
                animationManager.applyOffset();
                handleAccel('ArrowDown');
                break;
            case 'Equal':
            case 'NumpadAdd':
                e.preventDefault(); // Предотвращаем изменение масштаба в браузере
                animationManager.preserveScrollPosition(() => {
                    elements.fontRange.value = Math.min(+elements.fontRange.value + 5, elements.fontRange.max);
                    elements.textEl.style.fontSize = elements.fontRange.value + 'px';
                    elements.fontVal.textContent = elements.fontRange.value;
                });

                // Сохраняем настройки
                const settings = createSettingsSnapshot();
                saveSettings(settings);
                break;
            case 'Minus':
            case 'NumpadSubtract':
                e.preventDefault(); // Предотвращаем изменение масштаба в браузере
                animationManager.preserveScrollPosition(() => {
                    elements.fontRange.value = Math.max(+elements.fontRange.value - 5, elements.fontRange.min);
                    elements.textEl.style.fontSize = elements.fontRange.value + 'px';
                    elements.fontVal.textContent = elements.fontRange.value;
                });

                // Сохраняем настройки
                const settingsAfterMinus = createSettingsSnapshot();
                saveSettings(settingsAfterMinus);
                break;
            case 'Tab':
                e.preventDefault(); // Уже было, сохраняем
                cycleMirror();
                break;
            case 'Enter':
                e.preventDefault(); // Предотвращаем действие по умолчанию
                animationManager.resetScroll();
                break;
            case 'Slash': // Перехватываем слэш для предотвращения запуска поиска
                e.preventDefault();
                break;
        }
    }

    // Обработчики элементов управления
    function handleSpeedChange() {
        state.speedLines = +elements.speedRange.value;
        elements.speedVal.textContent = state.speedLines;

        // Сохраняем настройки
        const settings = createSettingsSnapshot();
        saveSettings(settings);
    }

    function handleFontChange() {
        animationManager.preserveScrollPosition(() => {
            elements.textEl.style.fontSize = elements.fontRange.value + 'px';
            elements.fontVal.textContent = elements.fontRange.value;
        });

        // Сохраняем настройки
        const settings = createSettingsSnapshot();
        saveSettings(settings);
    }

    function handleBoldChange() {
        animationManager.preserveScrollPosition(() => {
            setBold(elements.boldToggle.checked);
        });
    }

    function handleMirrorHChange() {
        animationManager.preserveScrollPosition(() => {
            state.mirrorState = (state.mirrorState & 2) | (elements.mirrorHToggle.checked ? 1 : 0);
            applyMirror();
        });

        // Сохраняем настройки
        const settings = createSettingsSnapshot();
        saveSettings(settings);
    }

    function handleMirrorVChange() {
        animationManager.preserveScrollPosition(() => {
            state.mirrorState = (state.mirrorState & 1) | (elements.mirrorVToggle.checked ? 2 : 0);
            applyMirror();
        });

        // Сохраняем настройки
        const settings = createSettingsSnapshot();
        saveSettings(settings);
    }

    // Создание снимка текущих настроек для сохранения
    function createSettingsSnapshot() {
        return {
            text: elements.textEl.textContent,
            font: +elements.fontRange.value,
            speed: +elements.speedRange.value,
            bold: elements.boldToggle.checked,
            mirror: state.mirrorState,
            language: state.currentLang,
            textAlign: elements.textEl.style.textAlign || 'center'
        };
    }

    // Возвращаем публичные методы и функции
    return {
        applyMirror,
        setBold,
        setTextAlign,
        toggleSidebar,
        toggleFS,
        handleFileUpload,
        handleKeyDown,
        stopAccel,
        handleSpeedChange,
        handleFontChange,
        handleBoldChange,
        handleMirrorHChange,
        handleMirrorVChange,
        createSettingsSnapshot
    };
}