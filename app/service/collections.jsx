import { authenticate } from '../shopify.server';
import { json } from '@remix-run/node';
import { GET_COLLECTIONS_QUERY } from "./query/collections"; // Importa la query
import { GET_ALL_CATEGORIES_QUERY, GET_PRODUCT_QUERY } from "./query/products"; // Importa le query per ottenere categorie e prodotti

// Funzione per caricare le collezioni
export const collectionsLoader = async (admin) => {
  const collections =await getCollections(admin)
  // console.log('collectionsLoader',collections )
  return json(collections);
};

// Funzione per caricare le collezioni
const getCollections = async (admin) => {
  const response = await admin.graphql(GET_COLLECTIONS_QUERY);
  const result = await response.json();
  // console.log('getCollections',result.data )
  const collections = result.data.collections.edges.map(edge => edge.node);
  return collections
};

export const collectionsMissingLoader = async (admin ) => {
  try {
    const existingCategoriesInProducts = await getExistingCategoriesInProducts(admin);
    
     const categoriesData = await getCollections(admin);
    // console.log("Categorie esistenti:", categoriesData);

    const missingCategories = getMissingCategoriesInProducts( categoriesData, existingCategoriesInProducts);
    // console.log("Categorie mancanti:", missingCategories);

    return json(missingCategories);
  } catch (error) {
    console.error("Errore nel caricamento delle categorie mancanti:", error);
    return json({ error: "Errore nel recupero delle categorie mancanti" }, { status: 500 });
  }
};

// Funzione per ottenere tutte le categorie esistenti in Shopify
const getExistingCategoriesInProducts = async (admin) => {
  const response = await admin.graphql(GET_ALL_CATEGORIES_QUERY);
  const result = await response.json();

  if (!result || !result.data || !result.data.products) {
    throw new Error("Errore nel recupero delle categorie esistenti");
  }

  const products = result.data.products.edges.map(edge => edge.node);

  // Estrai solo i valori unici di `productType`
  const existingCategories = [...new Set(products.map(product => product.productType).filter(Boolean))];

  return existingCategories;
};

// Funzione per verificare quali categorie non esistono su Shopify
const getMissingCategoriesInProducts =(existingCategories, categoriesData) => {
  // Assicuriamoci che `categoriesData` sia un array
  if (!Array.isArray(categoriesData)) {
    throw new Error("categoriesData deve essere un array");
  }

  console.log('Categorie esistenti:', existingCategories);
  console.log('Categorie fornite:', categoriesData);

  // Confronta `categoriesData` con `existingCategories`
  const missingCategories = categoriesData.filter(category => !existingCategories.includes(category));

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
  return await collectionsMissingLoader(admin, categoriesData);
};
