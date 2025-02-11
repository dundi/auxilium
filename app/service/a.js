import { CREATE_METAFIELD_MUTATION, CREATE_PRODUCT_CATEGORY_MUTATION } from './query/products'; // Importa le query di mutazione necessarie

// Funzione per aggiungere categorie mancanti su Shopify
export const addMissingCategories = async (admin, data) => {
  for (const category in data) {
    const products = data[category].tags;

    for (const tag in products) {
      for (const product of products[tag]) {
        const { id, title, metafields } = product;

        // Controlla se esiste già la categoria per questo prodotto
        const existingCategory = await checkIfCategoryExists(admin, category, tag);
        if (!existingCategory) {
          // Crea la categoria se non esiste
          await createCategory(admin, category, tag);
        }

        // Verifica e aggiungi metafields mancanti
        await addMissingMetafields(admin, id, metafields);
      }
    }
  }
};

// Funzione per controllare se la categoria esiste
const checkIfCategoryExists = async (admin, category, tag) => {
  const response = await admin.graphql(CREATE_PRODUCT_CATEGORY_MUTATION, {
    variables: {
      category,
      tag
    }
  });

  const result = await response.json();
  return result.data ? true : false; // Restituisce true se esiste, altrimenti false
};

// Funzione per creare una nuova categoria
const createCategory = async (admin, category, tag) => {
  const response = await admin.graphql(CREATE_PRODUCT_CATEGORY_MUTATION, {
    variables: {
      category,
      tag
    }
  });

  const result = await response.json();
  console.log(`Categoria ${category} con tag ${tag} creata con successo!`);
};

// Funzione per aggiungere i metafields mancanti
const addMissingMetafields = async (admin, productId, metafields) => {
  for (const metafield of metafields.edges) {
    const { namespace, key, value } = metafield.node;

    // Verifica se il metafield esiste già
    const existingMetafield = await checkIfMetafieldExists(admin, productId, namespace, key);
    if (!existingMetafield) {
      // Se non esiste, crea il metafield
      await createMetafield(admin, productId, namespace, key, value);
    }
  }
};

// Funzione per controllare se il metafield esiste
const checkIfMetafieldExists = async (admin, productId, namespace, key) => {
  const response = await admin.graphql(CREATE_METAFIELD_MUTATION, {
    variables: {
      productId,
      namespace,
      key
    }
  });

  const result = await response.json();
  return result.data ? true : false;
};

// Funzione per creare un nuovo metafield
const createMetafield = async (admin, productId, namespace, key, value) => {
  const response = await admin.graphql(CREATE_METAFIELD_MUTATION, {
    variables: {
      productId,
      namespace,
      key,
      value
    }
  });

  const result = await response.json();
  console.log(`Metafield ${key} creato con successo per il prodotto ${productId}`);
};
