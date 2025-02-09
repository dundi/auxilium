import React, { Suspense } from "react";
import { useCollections } from "../hooks/CollectionsData";

// Componente per visualizzare un messaggio di errore
function ErrorFallback({ error }) {
  return (
    <div style={{ color: "red" }}>
      Errore durante il recupero delle collections: {error.message}
    </div>
  );
}

// Componente principale CollectionsList
export default function CollectionsList() {
  return (
    <div>
      <h2>Lista delle Collezioni</h2>
      <Suspense
        fallback={<div>Caricamento delle collections...</div>} // Fallback durante il caricamento
        onError={(error) => (
          <ErrorFallback error={error} /> // Gestione degli errori
        )}
      >
        {/* Componente interno per visualizzare le collections */}
        <CollectionDisplay />
      </Suspense>
    </div>
  );
}

// Componente interno per visualizzare le collections
function CollectionDisplay() {
  const collections = useCollections(); // Usa l'hook per ottenere i dati

  return (
    <ul>
      {collections.map((collection) => (
        <li key={collection.id}>
          <strong>{collection.title}</strong> - Handle: {collection.handle}
        </li>
      ))}
    </ul>
  );
}
