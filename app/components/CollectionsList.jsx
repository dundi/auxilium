import React from 'react';

function CollectionsList({ collections }) {
  if (!collections || collections.length === 0) {
    return <div>Nessuna collezione trovata.</div>;
  }

  return (
    <div>
      <h2>Lista delle Collezioni</h2>
      <ul>
        {collections.map(collection => (
          <li key={collection.id}>
            <strong>{collection.title}</strong> - Handle: {collection.handle}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CollectionsList;
