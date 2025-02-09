import React, { useState, useEffect } from "react";
import {
    Page,
    Layout,
    Card,
    TextField,
    Select,
    Button,
    FormLayout,
} from "@shopify/polaris";
import { useFetcher } from "@remix-run/react";

const SetupPage = () => {
    const fetcher = useFetcher();
    const [formData, setFormData] = useState({
        welcomeMessage: "",
        aiLogo: "",
        category: "moda",
        openAiKey: "",
        temperature: "0.7",
        maxTokens: "200",
        userMessage: "",
        aiResponse: "Aspetta...",
    });

    useEffect(() => {
        const storedData = localStorage.getItem("setupFormData");
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        if (fetcher.data && fetcher.data.aiResponse) {
            setFormData((prevState) => ({
                ...prevState,
                aiResponse: fetcher.data.aiResponse,
            }));
        }
    }, [fetcher.data]);

    const handleSaveSettings = () => {
        localStorage.setItem("setupFormData", JSON.stringify(formData));
        console.log("Impostazioni salvate", formData);
    };

    const handleChange = (field) => (value) => {
        setFormData((prevState) => ({ ...prevState, [field]: value }));
    };

    const generateResponse = () => {
        fetcher.submit(
            { userMessage: formData.userMessage },
            { method: "POST", action: "/responseai" }
        );
    };

    return (
        <Page title="⚙️ Auxilium - Impostazioni">
            <Layout>
                <Layout.Section>
                    <Card title="Impostazioni Generali" sectioned>
                        <FormLayout>
                            <TextField
                                label="Messaggio di Benvenuto"
                                value={formData.welcomeMessage}
                                onChange={handleChange("welcomeMessage")}
                                placeholder="Inserisci un messaggio"
                            />
                            <TextField
                                label="URL Logo AI (GIF/JPG/PNG)"
                                value={formData.aiLogo}
                                onChange={handleChange("aiLogo")}
                                placeholder="Inserisci URL immagine"
                            />
                            <Select
                                label="Categoria"
                                options={["Moda", "Elettronica", "Giardinaggio", "Pet Food"]}
                                value={formData.category}
                                onChange={handleChange("category")}
                            />
                        </FormLayout>
                    </Card>

                    <Card title="🤖 Configurazione AI" sectioned>
                        <FormLayout>
                            <TextField
                                label="OpenAI API Key"
                                type="password"
                                value={formData.openAiKey}
                                onChange={handleChange("openAiKey")}
                                placeholder="Inserisci la chiave API di OpenAI"
                            />
                            <TextField
                                label="Creatività AI (0.1 - 1.0)"
                                type="number"
                                value={formData.temperature}
                                onChange={handleChange("temperature")}
                                min={0.1}
                                max={1.0}
                                step={0.1}
                            />
                            <TextField
                                label="Numero massimo di token"
                                type="number"
                                value={formData.maxTokens}
                                onChange={handleChange("maxTokens")}
                                min={50}
                                max={1000}
                                step={50}
                            />
                        </FormLayout>
                    </Card>

                    <Card title="🧠 Test AI Response" sectioned>
                        <FormLayout>
                            <TextField
                                label="Inserisci una domanda"
                                value={formData.userMessage}
                                onChange={handleChange("userMessage")}
                                placeholder="Scrivi una richiesta per l'AI..."
                            />
                            <Button primary onClick={generateResponse}>
                                📝 Genera Risposta AI
                            </Button>
                            <p><strong>Risposta AI:</strong></p>
                            <div style={{ border: "1px solid #ccc", padding: "10px", minHeight: "50px" }}>
                                {formData.aiResponse}
                            </div>
                        </FormLayout>
                    </Card>

                    <Button primary onClick={handleSaveSettings}>
                        💾 Salva Impostazioni
                    </Button>
                </Layout.Section>
            </Layout>
        </Page>
    );
};

export default SetupPage;
