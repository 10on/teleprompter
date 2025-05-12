// Переводы интерфейса на различные языки
const translations = {
    // Русский (базовый)
    'ru': {
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
        shortcuts: 'Space старт/стоп • ←/→ скорость • ↑/↓ сдвиг • ± размер • Tab зеркала • Enter начало • F fullscreen • H UI',
        px: 'px'
    },
    
    // English
    'en': {
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
        shortcuts: 'Space start/stop • ←/→ speed • ↑/↓ scroll • ± font size • Tab mirror • Enter reset • F fullscreen • H UI',
        px: 'px'
    },
    
    // Español
    'es': {
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
        shortcuts: 'Espacio inicio/parar • ←/→ velocidad • ↑/↓ desplazar • ± tamaño • Tab espejo • Enter reinicio • F pantalla • H UI',
        px: 'px'
    },
    
    // Français
    'fr': {
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
        shortcuts: 'Espace démarrer/arrêter • ←/→ vitesse • ↑/↓ défiler • ± taille • Tab miroir • Entrée reset • F plein écran • H UI',
        px: 'px'
    },
    
    // Deutsche
    'de': {
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
        shortcuts: 'Leertaste start/stopp • ←/→ geschwindigkeit • ↑/↓ scrollen • ± größe • Tab spiegel • Enter reset • F vollbild • H UI',
        px: 'px'
    }
};

// Экспорт для использования в основном скрипте
export default translations;