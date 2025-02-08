export const GET_COLLECTIONS_QUERY = `
  query GetCollections {
    collections(first: 10) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            src
          }
          products(first: 5) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
        }
      }
    }
  }
`;
