import React from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { shopify } from '../shopify.server';
import CollectionsList from '../components/CollectionsList';

export const loader = async ({ request }) => {
  const { admin } = await shopify.authenticate.admin(request);
  const response = await admin.graphql(`
    {
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `);
  const result = await response.json();
  const collections = result.data.collections.edges.map(edge => edge.node);
  return json(collections);
};

export default function CollectionsRoute() {
  const collections = useLoaderData();
  return (
    <div>
      <CollectionsList collections={collections} />
    </div>
  );
}
