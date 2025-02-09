import { json } from "@remix-run/node";
import axios from "axios";

const openAiKey = "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";

const db = {
    getSettings: () => ({
        ai: { openAiKey },
        color: "red",
        language: "uk",
    }),
    saveSettings: async (settings) => {
        console.log("Salvataggio delle impostazioni:", settings);
    }
};

export const action = async ({ request }) => {
    try {
        const { userMessage } = await request.json();
        if (!userMessage) {
            return json({ error: "Messaggio utente mancante" }, { status: 400 });
        }

        const response = await aiResponse(userMessage);
        return json({ aiResponse: response });
    } catch (error) {
        console.error("Errore generazione risposta AI:", error);
        return json({ error: "Errore nel server" }, { status: 500 });
    }
};

const aiResponse = async (userMessage) => {
    try {
        if (!userMessage || typeof userMessage !== "string") {
            return json({ error: "Messaggio utente non valido!" }, { status: 400 });
        }

        const settings = await db.getSettings();
        if (!settings.ai || !settings.ai.openAiKey) {
            return json({ error: "API Key OpenAI mancante!" }, { status: 400 });
        }

        const dataOpenAi = {
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Rispondi in modo professionale." },
                { role: "user", content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 200,
        };

        console.log("📡 Payload inviato a OpenAI:", JSON.stringify(dataOpenAi, null, 2));

        const response = await axios.post("https://api.openai.com/v1/chat/completions", dataOpenAi, {
            headers: {
                Authorization: `Bearer ${settings.ai.openAiKey}`,
                "Content-Type": "application/json",
            },
        });

        if (!response?.data?.choices?.length) {
            throw new Error("Risposta vuota da OpenAI");
        }

        const aiResponse = response.data.choices[0].message.content;
        console.log("✅ Risposta AI:", aiResponse);

        const history = settings.ai.history || [];
        history.push({ userMessage, aiResponse, timestamp: new Date().toISOString() });
        settings.ai.history = history;
        await db.saveSettings(settings);

        return aiResponse;
    } catch (error) {
        console.error("❌ Errore nella generazione della risposta AI:", error.response ? error.response.data : error.message);
        return "Errore nella generazione della risposta AI";
    }
};

