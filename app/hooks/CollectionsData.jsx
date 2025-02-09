import { useState, useEffect } from "react";

// Hook personalizzato per il fetching delle collections
export function useCollections() {
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Stato di caricamento

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/collections"); // Chiamata API alla route /collections
        if (!response.ok) {
          throw new Error("Impossibile recuperare le collections");
        }
        const data = await response.json(); // Parsiamo la risposta JSON
        setCollections(data); // Aggiorniamo lo stato con i dati ricevuti
      } catch (err) {
        console.error("Errore durante il recupero delle collections:", err);
        setError(err);
      } finally {
        setIsLoading(false); // Indipendentemente dall'esito, il caricamento termina
      }
    };

    fetchCollections(); // Esegui la funzione di fetch al mount del componente
  }, []);

  return { collections, error, isLoading };
}
