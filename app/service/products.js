import { POPULATE_PRODUCT_MUTATION, UPDATE_VARIANT_MUTATION } from "./query/products"; // Importa la query
import { json } from '@remix-run/node';

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
