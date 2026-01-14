// Модуль анимации и прокрутки телепромптера
export function createAnimationManager(elements, state) {
    let last = null; // Последний временной штамп для анимации

    // Вспомогательные вычисления
    const scrollDir = () => (state.mirrorState & 2) ? 1 : -1;
    const lineHeight = () => +elements.fontRange.value;

    // Функция для применения текущего смещения к интерфейсу
    function applyOffset() {
        elements.wrapper.style.transform = `translateY(${state.offset}px)`;
    }

    // Функция для сброса позиции прокрутки
    function resetScroll() {
        // Устанавливаем начальную позицию в зависимости от направления прокрутки
        state.offset = (scrollDir() === -1) ? elements.prompter.clientHeight : -elements.textEl.clientHeight;

        // Добавляем отступ в 2 строки
        const twoLinesOffset = lineHeight() * 2 * scrollDir();
        state.offset += twoLinesOffset;

        applyOffset();
    }

    // Функция для сохранения относительной позиции при изменении параметров
    function preserveScrollPosition(callback) {
        // Вычисляем текущую относительную позицию в процентах
        const textHeight = elements.textEl.clientHeight;
        if (textHeight === 0) {
            callback && callback();
            return;
        }

        // Вычисляем, какая часть текста прошла через экран (в процентах)
        let visibleHeight = elements.prompter.clientHeight;
        let totalScrollableHeight = textHeight + visibleHeight;

        // Определяем, как много текста уже проскроллено (от 0 до 1)
        let scrollProgressPercent;

        if (scrollDir() === -1) {
            // Направление прокрутки снизу вверх
            scrollProgressPercent = (elements.prompter.clientHeight - state.offset) / totalScrollableHeight;
        } else {
            // Направление прокрутки сверху вниз
            scrollProgressPercent = (state.offset + textHeight) / totalScrollableHeight;
        }

        // Ограничиваем значение между 0 и 1
        scrollProgressPercent = Math.max(0, Math.min(1, scrollProgressPercent));

        // Выполняем действие, которое меняет размеры
        callback && callback();

        // После изменения размеров восстанавливаем позицию прокрутки
        const newTextHeight = elements.textEl.clientHeight;
        const newTotalScrollableHeight = newTextHeight + elements.prompter.clientHeight;

        if (scrollDir() === -1) {
            // Направление прокрутки снизу вверх
            state.offset = elements.prompter.clientHeight - (scrollProgressPercent * newTotalScrollableHeight);
        } else {
            // Направление прокрутки сверху вниз
            state.offset = (scrollProgressPercent * newTotalScrollableHeight) - newTextHeight;
        }

        applyOffset();
    }

    // Функция шага анимации
    function step(ts) {
        if (!state.running) {
            last = null;
            return;
        }

        if (!last) last = ts;

        const dt = (ts - last) / 1000;
        last = ts;

        state.offset += scrollDir() * state.speedLines * lineHeight() * dt;
        applyOffset();

        // Reset when text scrolls off screen
        if (scrollDir() === -1 && state.offset < -elements.textEl.clientHeight) resetScroll();
        if (scrollDir() === 1 && state.offset > elements.prompter.clientHeight) resetScroll();

        requestAnimationFrame(step);
    }

    // Функция для старта/остановки прокрутки
    function toggleRun(translations, currentLang) {
        state.running = !state.running;
        elements.startStopBtn.textContent = state.running
            ? translations[currentLang].stop
            : translations[currentLang].start;
        if (state.running) requestAnimationFrame(step);
    }

    // Возвращаем публичные методы
    return {
        toggleRun,
        resetScroll,
        preserveScrollPosition,
        applyOffset,
        scrollDir,
        lineHeight
    };
}