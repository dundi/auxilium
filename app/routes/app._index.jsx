import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { HeaderDashboard } from '../components/HeaderDashboard';
import { StatisticsCard } from '../components/StatisticsCard';
import { NewsCard } from '../components/NewsCard';
import CollectionsList  from '../components/CollectionsList';
import {productsMut} from '../service/products';

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  return productsMut(admin, color)
};

export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });
 console.log('Richiesta ricevuta su /api/test');
  return (
      <Layout>
        <Page title="Dashboard">
          <HeaderDashboard />
         
         <BlockStack spacing="loose">
          <Text as="h2" variant="headingMd">
            Navigate to Collections
          </Text>
          <Link url="/collections" external={false}>
            Go to Collections
          </Link>

          {/* Bottone per generare prodotti */}
          <Button primary onClick={generateProduct} disabled={isLoading}>
            {isLoading ? "Creating..." : "Generate Product"}
          </Button>
        </BlockStack>
          <StatisticsCard />
          <NewsCard />
        </Page>
      </Layout>
    );
  }
