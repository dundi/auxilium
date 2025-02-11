export const POPULATE_PRODUCT_MUTATION = `
  mutation populateProduct($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product {
        id
        title
        handle
        status
        variants(first: 10) {
          edges {
            node {
              id
              price
              barcode
              createdAt
            }
          }
        }
      }
    }
  }
`;

export const PRODUCT_ALL = `query GetAllProducts($first: Int!, $after: String) {
  products(first: $first, after: $after) { 
    edges {
      node {
        id
        title
        description
        productType
        vendor
        tags
        createdAt
        updatedAt
        publishedAt
        collections(first: 5) {
          edges {
            node {
              id
              title
            }
          }
        }
        images(first: 5) {
          edges {
            node {
              src
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              sku
              barcode
              price
              compareAtPrice
              availableForSale
              inventoryQuantity
              inventoryPolicy
              inventoryItem {
                id
                tracked
              }
            }
          }
        }
        metafields(first: 20) {
          edges {
            node {
              namespace
              key
              value
              type
            }
          }
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`;

export const GET_GROUPED_PRODUCTS_QUERY = `
  query GetGroupedProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          productType
          tags
          metafields(first: 20) {
            edges {
              node {
                namespace
                key
                value
                type
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;



export const UPDATE_VARIANT_MUTATION = `
  mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants {
        id
        price
        barcode
        createdAt
      }
    }
  }
`;
