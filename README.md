# Minimalist Web Teleprompter

A lightweight, self-hosted HTML teleprompter that runs entirely in the browser – no frameworks, no build step, and no backend required.  
Ideal for use with physical mirror teleprompters (AliExpress-style) and older tablets (e.g. iPad Mini 4).  
Designed and generated in collaboration with [ChatGPT, model `gpt-o-3`](https://openai.com/gpt-4).

---

## 💡 Features

- ✅ Works offline (HTML + JS only)
- ✅ Upload any `.txt` file (supports UTF-8)
- ✅ Mirror text (horizontal, vertical, both)
- ✅ Auto-scroll at customizable speed (in lines per second)
- ✅ Fullscreen mode (F key or button)
- ✅ Remembers your last session using `localStorage`
- ✅ Compatible with Safari on iOS, including old devices (tested on iOS 15)

---

## 🎮 Controls

| Function                | Hotkey         | UI Button         |
|-------------------------|----------------|-------------------|
| Start / Stop scrolling  | `Space`        | ▶ Start           |
| Speed up/down           | `→` / `←`      | Speed slider      |
| Font size up/down       | `+` / `-`      | Font slider       |
| Scroll manually         | `↑` / `↓`      | –                 |
| Jump to beginning       | `Enter`        | ⟲ Reset           |
| Toggle bold font        | –              | ✔ Bold            |
| Toggle horizontal flip  | –              | ✔ Mirror H        |
| Toggle vertical flip    | –              | ✔ Mirror V        |
| Cycle mirror modes      | `Tab`          | –                 |
| Toggle UI               | `H`            | –                 |
| Toggle Fullscreen       | `F`            | ⤢ Full            |

Manual scrolling (`↑` / `↓`) accelerates on key hold.
