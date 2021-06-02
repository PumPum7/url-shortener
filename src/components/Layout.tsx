import React from "react";

import Footer from "@components/Footer";
import Header from "@components/Header";

export const Layout = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    return (
        <div className="mx-auto max-w-sm md:max-w-2xl lg:max-w-screen-md">
            <Header />
            {children}
            <Footer />
        </div>
    );
};

export default Layout;
