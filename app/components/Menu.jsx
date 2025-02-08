import React from "react";
import { Frame, Navigation } from "@shopify/polaris";
import {
    HomeFilledIcon,
    CollectionFeaturedIcon,
    ProductFilledIcon,
} from "@shopify/polaris-icons";
import { useNavigate } from "@remix-run/react";


const Menu = () => {
    const navigate = useNavigate();

    return (
        <Frame>
            <Navigation location="/">
                <Navigation.Section
                    items={[
                        {
                            label: "Dashboard",
                            icon: HomeFilledIcon,
                            onClick: () => navigate("/app"),
                        },
                        {
                            label: "Collezioni",
                            icon: CollectionFeaturedIcon,
                            onClick: () => navigate("/collections"),
                        },
                        {
                            label: "Prodotti",
                            icon: ProductFilledIcon,
                            onClick: () => navigate("/products"),
                        },
                    ]}
                />
            </Navigation>
        </Frame>
    );
};

export default Menu;
