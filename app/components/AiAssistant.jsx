import React, { useState } from "react";
import { Card, TextField, Button, FormLayout } from "@shopify/polaris";
import { useGenerateResponse } from "../hooks/useGenerateResponse";

export function AiAssistant() {
  const { aiResponse, generateResponse } = useGenerateResponse();
  const [userInput, setUserInput] = useState("");

  const handleGenerate = () => {
    generateResponse(userInput);
  };

  return (
    <Card title="📰 Ultime novità" sectioned>
      <FormLayout>
        <TextField
          label="Fai una domanda sulle ultime novità"
          value={userInput}
          onChange={setUserInput}
          placeholder="Inserisci una richiesta per l'AI..."
        />
        <Button primary onClick={handleGenerate}>
          📝 Genera Risposta
        </Button>
        <p><strong>Risposta AI:</strong></p>
        <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: "50px" }}>
          {aiResponse}
        </div>
      </FormLayout>
    </Card>
  );
}

