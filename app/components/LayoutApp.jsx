import React, { useState } from "react";
import {
    Page,
    Layout,
    Card,
    Frame,
    Navigation,
} from "@shopify/polaris";
import {
    SettingsFilledIcon,
    CollectionFeaturedIcon,
    ProductFilledIcon,
} from "@shopify/polaris-icons";
import { useNavigate } from "@remix-run/react";
import { HeaderDashboard } from "./HeaderDashboard";
import SetupPage from "./Setup";
import { StatisticsCard } from "./StatisticsCard";
import { NewsCard } from "./NewsCard";

function LayoutApp() {
    const navigate = useNavigate();
    const [selectedPage, setSelectedPage] = useState("setup");

    const renderContent = () => {
        switch (selectedPage) {
            case "dashboard":
                return <StatisticsCard />;
            case "collections":
                return <NewsCard />;
            case "products":
                return <p>Gestione prodotti in arrivo...</p>;
            default:
                return <SetupPage />;
        }
    };

    return (
        <Frame
            navigation={
                <Navigation location="/">
                    <Navigation.Section
                        items={[
                            {
                                label: "Setup",
                                icon: SettingsFilledIcon,
                                onClick: () => setSelectedPage("Setup"),
                            },
                            {
                                label: "Collezioni",
                                icon: CollectionFeaturedIcon,
                                onClick: () => setSelectedPage("collections"),
                            },
                            {
                                label: "Prodotti",
                                icon: ProductFilledIcon,
                                onClick: () => setSelectedPage("products"),
                            },
                        ]}
                    />
                </Navigation>
            }
        >
            <Page title="Setup">
                <HeaderDashboard />
                <Layout>
                    <Layout.Section>
                        {renderContent()}
                    </Layout.Section>
                </Layout>
            </Page>
        </Frame>
    );
}

export default LayoutApp;
