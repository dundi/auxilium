import { POPULATE_PRODUCT_MUTATION, UPDATE_VARIANT_MUTATION, PRODUCT_ALL, GET_GROUPED_PRODUCTS_QUERY } from "./query/products"; // Importa la query
import { json } from '@remix-run/node';

const variables = (first, after) =>({
  variables: {first, after}
})
	
export const productsLoader = async (admin ) => {
  const response = await admin.graphql(PRODUCT_ALL, variables(first, after));
  const result = await response.json();
  const data = result.data.products.edges.map(edge => edge.node);
  return json(data);
};

export const productsMut = async (admin, color ) => {
	  const response = await admin.graphql(POPULATE_PRODUCT_MUTATION, {
    variables: {
      product: {
        title: `${color} Snowboard`,
      },
    },
  })
  
    const responseJson = await response.json();
    const product = responseJson.data.productCreate.product;

    // Estrai l'ID della variante
  const variantId = product.variants.edges[0].node.id;

  // Esegui la seconda mutazione per aggiornare la variante
  const variantResponse = await admin.graphql(UPDATE_VARIANT_MUTATION, {
    variables: {
      productId: product.id,
      variants: [{ id: variantId, price: "100.00" }],
    },
  });
  
  const variantResponseJson = await variantResponse.json();

  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  };
};
export const productsGroupLoader = async (admin) => {
  let allProducts = [];
  let hasNextPage = true;
  let after = null;

  while (hasNextPage) {

    const response = await admin.graphql(GET_GROUPED_PRODUCTS_QUERY, variables(250, after || null));
    const data = await response.json();

    if (!data || !data.data) {
      throw new Error("Errore nel recupero dei prodotti");
    }

    const products = data.data.products.edges.map(edge => edge.node);
    allProducts = [...allProducts, ...products]; // Migliorata concatenazione array

    hasNextPage = data.data.products.pageInfo.hasNextPage;
    after = data.data.products.pageInfo.endCursor || null;
  }

  return groupProducts(allProducts);
};

// Funzione per raggruppare i prodotti
const groupProducts = (products) => {
  return products.reduce((acc, product) => {
    const { productType, tags, metafields } = product;

    // Inizializza il gruppo per productType
    if (!acc[productType]) {
      acc[productType] = { tags: {}, metafields: {} };
    }

    // Raggruppa per tags
    tags.forEach(tag => {
      if (!acc[productType].tags[tag]) {
        acc[productType].tags[tag] = [];
      }
      acc[productType].tags[tag].push(product);
    });

    // Raggruppa per metafields.type
    metafields.edges.forEach(({ node }) => {
      const { type } = node;
      if (!acc[productType].metafields[type]) {
        acc[productType].metafields[type] = [];
      }
      acc[productType].metafields[type].push(product);
    });

    return acc;
  }, {});
};


/*
 {
  "Scarpe": {
    "tags": {
      "Sport": [{ "id": "1", "title": "Scarpa Rossa" }],
      "Estivo": [{ "id": "1", "title": "Scarpa Rossa" }]
    },
    "metafields": {
      "string": [{ "id": "1", "title": "Scarpa Rossa" }],
      "boolean": [{ "id": "1", "title": "Scarpa Rossa" }]
    }
  },
  "Accessori": {
    "tags": {
      "Moda": [{ "id": "2", "title": "Borsa Blu" }],
      "Inverno": [{ "id": "2", "title": "Borsa Blu" }]
    },
    "metafields": {
      "string": [{ "id": "2", "title": "Borsa Blu" }]
    }
  }
}

*/
