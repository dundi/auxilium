import React, { useState } from "react";
import { Card, TextField, Button, FormLayout, Scrollable } from "@shopify/polaris";
import { useGenerateResponse } from "../hooks/useGenerateResponse";

export function AiAssistant() {
  const { aiResponse, generateResponse } = useGenerateResponse();
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleGenerate = () => {
    if (!userInput.trim()) return;

    // Aggiunge il messaggio dell'utente alla cronologia
    const newChatHistory = [...chatHistory, { type: "user", message: userInput }];

    setChatHistory(newChatHistory);
    setUserInput(""); // Resetta l'input

    generateResponse(userInput);
  };

  // Aggiunge la risposta AI alla chat history ogni volta che cambia
  React.useEffect(() => {
    if (aiResponse && aiResponse !== "Aspetta...") {
      setChatHistory((prevChat) => [...prevChat, { type: "ai", message: aiResponse }]);
    }
  }, [aiResponse]);

  return (
    <Card title="💬 Assistente AI" sectioned>
      <Scrollable shadow style={{ maxHeight: "400px", padding: "10px", border: "1px solid #ccc" }}>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            style={{
              textAlign: chat.type === "user" ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "80%",
                backgroundColor: chat.type === "user" ? "#cfe2ff" : "#f0f0f0",
                color: "#000",
              }}
            >
              {chat.message}
            </div>
          </div>
        ))}
      </Scrollable>

      <div style={{ marginTop: "10px" }}>
        <FormLayout>
          <TextField
            label="Scrivi un messaggio"
            value={userInput}
            onChange={setUserInput}
            placeholder="Inserisci un messaggio..."
            multiline={3} // 🔹 Abilita TextArea con 3 righe di default
          />
          <Button primary onClick={handleGenerate}>
            📝 Invia
          </Button>
        </FormLayout>
      </div>
    </Card>
  );
}