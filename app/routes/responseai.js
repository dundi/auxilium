import { json } from "@remix-run/node";
import axios from "axios";
import { keys } from "../../.secret"
import { db } from "../service/db";

// Usa variabili d'ambiente per maggiore sicurezza
const openAiKey = keys.openAiKey

export const action = async ({ request }) => {
    try {
        if (request.method !== "POST") {
            return json({ error: "Usa una richiesta POST" }, { status: 405 });
        }

        console.log("📩 Metodo richiesta:", request.method);
        console.log("📩 Headers ricevuti:", JSON.stringify(Object.fromEntries(request.headers), null, 2));

        let body;

        // Controlla il tipo di contenuto per gestire JSON e x-www-form-urlencoded
        const contentType = request.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            body = await request.json();
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
            const formData = await request.formData();
            body = Object.fromEntries(formData); // Converte formData in oggetto JS
        } else {
            return json({ error: "Formato non supportato" }, { status: 415 });
        }

        console.log("📩 Body ricevuto:", body);

        if (!body.userMessage) {
            console.error("❌ Messaggio utente mancante!");
            return json({ error: "Messaggio utente mancante" }, { status: 400 });
        }

        console.log("📩 Messaggio utente:", body.userMessage);

        const response = await aiResponse(body.userMessage);
        return json({ aiResponse: response });
    } catch (error) {
        console.error("❌ Errore generazione risposta AI:", error);
        return json({ error: "Errore nel server" }, { status: 500 });
    }
};

const aiResponse = async (userMessage) => {
    try {
        if (!userMessage || typeof userMessage !== "string") {
            throw new Error("Messaggio utente non valido");
        }

        const settings = await db.getSettings();
        if (!settings.ai || !settings.ai.openAiKey) {
            throw new Error("API Key OpenAI mancante");
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
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Payload inviato a OpenAI:", openAiKey);
        const response = await axios.post("https://api.openai.com/v1/chat/completions", dataOpenAi, {
            headers: {
                Authorization: `Bearer ${openAiKey}`,
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
        console.error("❌ Errore nella richiesta a OpenAI:", error.response?.data || error.message);
        return "Errore nella generazione della risposta AI.";
    }
};

// Gestione richieste GET (evita errore 404 aprendo l'URL nel browser)
export const loader = async () => {
    return json({ error: "Usa una richiesta POST" }, { status: 405 });
};
