import React from "react";

export default function CollectionsView({ collections }) {
  if (collections.length === 0) {
    return <p>Nessuna collezione disponibile.</p>;
  }

  return (
    <ul>
      {collections.map((collection) => (
        <li key={collection.id}>
          <strong>{collection.title ? collection.title : collection}</strong> {collection.title  && 'Handle : ' + collection.handle}
        </li>
      ))}
    </ul>
  );
}
