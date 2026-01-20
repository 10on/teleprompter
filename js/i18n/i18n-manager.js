// Модуль для управления интернационализацией
import translations from './translations.js';

// Функция для применения языка интерфейса
export function applyLanguage(lang, elements, running) {
    if (!translations[lang]) return;

    // Обновляем HTML атрибут lang
    document.getElementById('html-root').setAttribute('lang', lang);

    // Обновляем все элементы с атрибутом data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Обновляем текст кнопки старт/стоп
    if (elements.startStopBtn) {
        elements.startStopBtn.textContent = running
            ? translations[lang].stop
            : translations[lang].start;
    }
}

// Экспортируем translations для удобства
export { translations };
