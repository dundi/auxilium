import React from 'react';
import { useLoaderData } from '@remix-run/react';
import { authenticate } from '../shopify.server';
import CollectionsList from '../components/CollectionsList';
import {collectionsLoader} from '../service/collections';

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  return await collectionsLoader(admin)
};
