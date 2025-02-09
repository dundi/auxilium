import { useState, useEffect } from "react";

// Hook personalizzato per il fetching delle collections
export function useCollections() {
  const [collections, setCollections] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/collections"); // Chiamata API alla route /collections
        if (!response.ok) {
          throw new Error("Impossibile recuperare le collections");
        }
        const data = await response.json(); // Parsa la risposta JSON
        setCollections(data); // Aggiorna lo stato con i dati ricevuti
      } catch (err) {
        console.error("Errore durante il recupero delle collections:", err);
        setError(err); // Imposta l'errore nello stato
      }
    };

    fetchCollections(); // Esegui la funzione di fetch al mount del componente
  }, []);

  // Se c'è un errore, lancialo per farlo gestire da Suspense
  if (error) {
    throw error;
  }

  // Se i dati non sono pronti, aspetta
  if (!collections || collections.length === 0) {
    throw new Promise(() => {
      // Promessa non risolta per far attendere Suspense
    });
  }

  return collections; // Restituisci i dati quando sono pronti
}
