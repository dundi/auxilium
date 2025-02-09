import { keys } from "../../.secret"
// Usa variabili d'ambiente per maggiore sicurezza
const openAiKey = keys.openAiKey

export const db = {
    getSettings: async () => ({
        ai: { openAiKey },
        color: "red",
        language: "uk",
    }),
    saveSettings: async (settings) => {
        console.log("✅ Salvataggio delle impostazioni:", settings);
    }
};