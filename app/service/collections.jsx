import { authenticate } from '../shopify.server';
import { json } from '@remix-run/node';
import { GET_COLLECTIONS_QUERY } from "./query/collections"; // Importa la query
import { GET_ALL_CATEGORIES_QUERY, GET_PRODUCT_QUERY } from "./query/products"; // Importa le query per ottenere categorie e prodotti

export const collectionsLoader = async (admin ) => {
  const response = await admin.graphql(GET_COLLECTIONS_QUERY);
  const result = await response.json();
  const collections = result.data.collections.edges.map(edge => edge.node);
  return json(collections);
};

// Funzione per ottenere tutte le categorie esistenti in Shopify
export const getExistingCategories = async (admin) => {
  const response = await admin.graphql(GET_ALL_CATEGORIES_QUERY);
  const result = await response.json();
  console.log('xxxxxxx', result.data)
  if (!result || !result.data || !result.data.productTypes) {
    throw new Error("Errore nel recupero delle categorie esistenti");
  }
  
  // Estrai le categorie esistenti
  const existingCategories = result.data.productTypes.map(category => category.name);
  return existingCategories;
};

// Funzione per verificare quali categorie non esistono su Shopify
export const getMissingCategories = async (admin, categoriesData) => {
  const existingCategories = await getExistingCategories(admin);
  const missingCategories = [];

  // Scorri tutte le categorie nel JSON parziale
  Object.keys(categoriesData).forEach(categoryName => {
    if (!existingCategories.includes(categoryName)) {
      missingCategories.push(categoryName); // Aggiungi le categorie non esistenti
    }
  });

  return missingCategories;
};

// Funzione per ottenere i dati di un prodotto
export const getProduct = async (admin, productId) => {
  const response = await admin.graphql(GET_PRODUCT_QUERY, {
    variables: { id: productId },
  });
  const result = await response.json();

  if (!result || !result.data || !result.data.product) {
    throw new Error("Errore nel recupero del prodotto");
  }

  return result.data.product;
};

// Funzione principale per ottenere le categorie mancanti
export const getMissingCategoriesForProducts = async (admin, categoriesData) => {
  const missingCategories = await getMissingCategories(admin, categoriesData);
  return missingCategories;
};
