// Переводы интерфейса на различные языки
const translations = {
    // Русский (базовый)
    'ru': {
        welcome: 'Добро пожаловать!<br>Это телепромптер.<br><small>Настройки в правом верхнем углу ☰</small>',
        loadFile: 'Загрузить файл',
        speed: 'Скорость (стр/с)',
        fontSize: 'Размер шрифта',
        bold: 'Жирный',
        mirrorH: 'Гориз. зеркало',
        mirrorV: 'Вертик. зеркало',
        start: 'Старт (Space)',
        stop: 'Стоп (Space)',
        reset: 'В начало (Enter)',
        fullscreen: 'Full (F)',
        voiceControl: '🎙️ Голосовое управление <small>(эксперимент)</small>',
        shortcuts: 'Space старт/стоп • ←/→ скорость • ↑/↓ сдвиг • ± размер • Tab зеркала • Enter начало • F fullscreen • H UI',
        px: 'px',
        textAlign: 'Выравнивание текста',
        settings: 'Настройки',
        language: 'Язык'
    },

    // English
    'en': {
        welcome: 'Welcome!<br>This is a teleprompter.<br><small>Settings in the top right corner ☰</small>',
        loadFile: 'Load File',
        speed: 'Speed (lines/s)',
        fontSize: 'Font Size',
        bold: 'Bold',
        mirrorH: 'Mirror H',
        mirrorV: 'Mirror V',
        start: 'Start (Space)',
        stop: 'Stop (Space)',
        reset: 'Reset (Enter)',
        fullscreen: 'Full (F)',
        voiceControl: '🎙️ Voice Control <small>(experimental)</small>',
        shortcuts: 'Space start/stop • ←/→ speed • ↑/↓ scroll • ± font size • Tab mirror • Enter reset • F fullscreen • H UI',
        px: 'px',
        textAlign: 'Text Alignment',
        settings: 'Settings',
        language: 'Language'
    },

    // Español
    'es': {
        welcome: '¡Bienvenido!<br>Esto es un teleprompter.<br><small>Ajustes en la esquina superior derecha ☰</small>',
        loadFile: 'Cargar archivo',
        speed: 'Velocidad (l/s)',
        fontSize: 'Tamaño de fuente',
        bold: 'Negrita',
        mirrorH: 'Espejo H',
        mirrorV: 'Espejo V',
        start: 'Iniciar (Espacio)',
        stop: 'Parar (Espacio)',
        reset: 'Reiniciar (Enter)',
        fullscreen: 'Completo (F)',
        voiceControl: '🎙️ Control de voz <small>(experimental)</small>',
        shortcuts: 'Espacio inicio/parar • ←/→ velocidad • ↑/↓ desplazar • ± tamaño • Tab espejo • Enter reinicio • F pantalla • H UI',
        px: 'px',
        textAlign: 'Alineación de texto',
        settings: 'Ajustes',
        language: 'Idioma'
    },

    // Français
    'fr': {
        welcome: 'Bienvenue!<br>Ceci est un téléprompteur.<br><small>Paramètres en haut à droite ☰</small>',
        loadFile: 'Charger fichier',
        speed: 'Vitesse (l/s)',
        fontSize: 'Taille police',
        bold: 'Gras',
        mirrorH: 'Miroir H',
        mirrorV: 'Miroir V',
        start: 'Démarrer (Espace)',
        stop: 'Arrêter (Espace)',
        reset: 'Réinitialiser (Entrée)',
        fullscreen: 'Plein écran (F)',
        voiceControl: '🎙️ Contrôle vocal <small>(expérimental)</small>',
        shortcuts: 'Espace démarrer/arrêter • ←/→ vitesse • ↑/↓ défiler • ± taille • Tab miroir • Entrée reset • F plein écran • H UI',
        px: 'px',
        textAlign: 'Alignement du texte',
        settings: 'Paramètres',
        language: 'Langue'
    },

    // Deutsche
    'de': {
        welcome: 'Willkommen!<br>Dies ist ein Teleprompter.<br><small>Einstellungen oben rechts ☰</small>',
        loadFile: 'Datei laden',
        speed: 'Geschwindigkeit (Z/s)',
        fontSize: 'Schriftgröße',
        bold: 'Fett',
        mirrorH: 'Spiegel H',
        mirrorV: 'Spiegel V',
        start: 'Start (Leertaste)',
        stop: 'Stopp (Leertaste)',
        reset: 'Zurücksetzen (Enter)',
        fullscreen: 'Vollbild (F)',
        voiceControl: '🎙️ Sprachsteuerung <small>(experimentell)</small>',
        shortcuts: 'Leertaste start/stopp • ←/→ geschwindigkeit • ↑/↓ scrollen • ± größe • Tab spiegel • Enter reset • F vollbild • H UI',
        px: 'px',
        textAlign: 'Textausrichtung',
        settings: 'Einstellungen',
        language: 'Sprache'
    }
};

// Экспорт для использования в основном скрипте
export default translations;