import React from "react";

import Header from "@components/Header";
import Footer from "@components/Footer";

export const Layout = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    return (
        <div className={"mx-auto max-w-sm md:max-w-2xl lg:max-w-screen-md"}>
            <Header />
            {children}
            <Footer />
        </div>
    );
};

export default Layout;
