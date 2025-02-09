import { useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";


export function useGenerateResponse() {
    const fetcher = useFetcher();
    const [aiResponse, setAiResponse] = useState("Aspetta...");

    useEffect(() => {
        if (fetcher.data && fetcher.data.aiResponse) {
            setAiResponse(fetcher.data.aiResponse);
        }
    }, [fetcher.data]);

    const generateResponse = (userMessage) => {
        if (!userMessage.trim()) {
            setAiResponse("Inserisci una richiesta valida.");
            return;
        }

        fetcher.submit(
            { userMessage },
            { method: "POST", action: "/responseai" }
        );
    };

    return { aiResponse, generateResponse };
}
