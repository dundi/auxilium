import { authenticate } from '../shopify.server';
import { json } from '@remix-run/node';
import { GET_COLLECTIONS_QUERY } from "./query/collections"; // Importa la query

export const collectionsLoader = async (admin ) => {
  const response = await admin.graphql(GET_COLLECTIONS_QUERY);
  const result = await response.json();
  const collections = result.data.collections.edges.map(edge => edge.node);
  return json(collections);
};
