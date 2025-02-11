import React, { Suspense } from "react";
import { useCollections } from "../hooks/CollectionsData";
import CollectionsView from "./CollectionsView";

// Componente per visualizzare un messaggio di errore
function ErrorFallback({ error }) {
  return <div style={{ color: "red" }}>Errore: {error.message}</div>;
}

// Componente che carica e gestisce i dati delle collezioni
export default function CollectionsLoader({ isMissing }) {
  const { collections, error, isLoading } = useCollections(isMissing);
	
  if (isLoading) {
    return <p>Caricamento delle collezioni...</p>;
  }

  if (error) {
    return <ErrorFallback error={error} />;
  }

  return (
    <div>
      <Suspense fallback={<div>Caricamento delle collections...</div>}>
        <CollectionsView collections={collections} />
      </Suspense>
    </div>
  );
}
