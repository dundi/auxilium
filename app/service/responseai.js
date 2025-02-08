import { json } from "@remix-run/node";
import axios from "axios";
const db = {
    getSettings: () => (
        {
            ai: {
                openAiKey: "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"

            }
        }
    )
}

export const aiResponse = async (body) => {
    try {
        const { userMessage } = body;

        if (!userMessage || typeof userMessage !== "string") {
            return json({ error: "Messaggio utente non valido!" }, { status: 400 });
        }

        const settings = await db.getSettings();

        if (!settings.ai || !settings.ai.openAiKey) {
            return json({ error: "API Key OpenAI mancante!" }, { status: 400 });
        }

        const maxTokens = parseInt(settings.ai.maxTokens, 10);
        const temperature = parseFloat(settings.ai.temperature);

        const dataOpenAi = {
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Rispondi in modo professionale." },
                { role: "user", content: userMessage },
            ],
            temperature: !isNaN(temperature) ? temperature : 0.7,
            max_tokens: Number.isInteger(maxTokens) ? maxTokens : 200,
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

        // Salva la risposta nel database
        const history = settings.ai.history || [];
        history.push({ userMessage, aiResponse, timestamp: new Date().toISOString() });
        settings.ai.history = history;
        await db.saveSettings(settings);

        return json({ aiResponse });
    } catch (error) {
        console.error("❌ Errore nella generazione della risposta AI:", error.response ? error.response.data : error.message);
        return json({ error: error.response ? error.response.data : "Errore nella generazione della risposta AI" }, { status: 500 });
    }
};
