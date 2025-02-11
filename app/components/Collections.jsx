// app/components/NewsCard.jsx
import React from 'react';
import { Card } from '@shopify/polaris';
import CollectionsLoader from './CollectionsLoader';
import { AiAssistant } from './AiAssistant';

export function Collections() {
    return (
        <div>
              <h2>Lista delle Collezioni</h2>
            <CollectionsLoader />
            <h2>Collezioni non presenti </h2>
             <CollectionsLoader isMissing={true} />
            <AiAssistant />
        </div>
    );
}
