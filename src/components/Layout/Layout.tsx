import React from "react";

import Footer from "@components/Layout/Footer";
import Header from "@components/Layout/Header";

export const Layout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <>
            <div className="mx-auto max-w-sm md:max-w-2xl lg:max-w-(--breakpoint-md)">
                <Header />
                {children}
            </div>
            <Footer />
        </>
    );
};

export default Layout;
