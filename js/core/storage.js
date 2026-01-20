// Модуль для управления хранилищем настроек телепромптера

// Конфигурация хранилища
const STORAGE_KEY = 'teleprompterSettings';

// Определение языка браузера и поиск ближайшего поддерживаемого языка
export function detectBrowserLanguage() {
    // Поддерживаемые языки
    const supportedLanguages = ['ru', 'en', 'es', 'fr', 'de'];

    // Получаем язык браузера (navigator.languages более предпочтителен, т.к. содержит массив языков по приоритету)
    const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage];

    // Перебираем языки из настроек браузера
    for (let lang of browserLanguages) {
        // Обрезаем язык до 2 символов (например, 'ru-RU' -> 'ru')
        const shortLang = lang.substring(0, 2).toLowerCase();

        // Если язык поддерживается, возвращаем его
        if (supportedLanguages.includes(shortLang)) {
            return shortLang;
        }
    }

    // Если подходящего языка не найдено, возвращаем английский по умолчанию
    return 'en';
}

// Функции для работы с локальным хранилищем
export function saveSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
        // Silent fail if localStorage isn't available
        console.error('Не удалось сохранить настройки:', e);
    }
}

export function loadSettings() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
        console.error('Не удалось загрузить настройки:', e);
        return {};
    }
}
