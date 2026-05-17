import gradient from "gradient-string";

const limpiar = (texto) => texto.replace(/[\u{1F680}\u{1F4BB}\u{1F49A}\u{1F4E6}\u{1F525}\u{1F7E0}-\u{1F7E9}\u{1F49C}\u{2705}\u{1F310}\u{1F4DD}]/gu, '').replace(/\s+/g, ' ').trim();

export const textoColorido = (messages, colors = ["#09bc09", "#3cff00"], modoProduction = false) => {
    const maxLen = Math.max(...messages.map(m => m.length));
    const borde = "═".repeat(maxLen + 4);
    const grad = gradient(colors);

    if (modoProduction) {
        const msgs = messages.map(limpiar);
        msgs.forEach(m => console.log(m));
        return;
    } else {
        console.log(grad(`╔${borde}╗`));
        messages.forEach(m => console.log(grad(`║ ${m}${' '.repeat(maxLen - m.length)}   ║`)));
        console.log(grad(`╚${borde}╝`));
    }
};