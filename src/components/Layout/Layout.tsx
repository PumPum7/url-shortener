import React from "react";

import Footer from "@components/Layout/Footer";
import Header from "@components/Layout/Header";

export const Layout = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    return (
        <>
            <div className="mx-auto max-w-sm md:max-w-2xl lg:max-w-screen-md">
                <Header />
                {children}
            </div>
            <Footer />
        </>
    );
};

export default Layout;
