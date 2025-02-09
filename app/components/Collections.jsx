// app/components/NewsCard.jsx
import React from 'react';
import { Card } from '@shopify/polaris';
import CollectionsList from './CollectionsList';
import { AiAssistant } from './AiAssistant';

export function Collections() {
    return (
        <div>
            <CollectionsList />
            <AiAssistant />
        </div>
    );
}