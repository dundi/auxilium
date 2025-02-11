import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { collectionsLoader, collectionsMissingloader } from "../service/collections";
import { productsGroupLoader, productsLoader} from "../service/products";

const loaders = {
  collections: collectionsLoader,
  products: productsLoader,
  productsGroup: productsGroupLoader,
  missingCategory: collectionsMissingloader
};

export const loader = async ({ request, params }) => {
  const { admin } = await authenticate.admin(request);

  if (params.resource in loaders) {
    return await loaders[params.resource](admin);
  }

  throw new Response("Not Found", { status: 404 });
};

