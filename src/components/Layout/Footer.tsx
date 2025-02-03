import React from "react";

export const Footer = (): React.ReactElement  => {
    return (
        <footer className="bg-white shadow-inner py-6">
            <div className="container mx-auto px-4">
                <p className="text-center text-gray-600 text-sm">
                    Made with 💚 by{" "}
                    <a
                        className="link hover:text-indigo-600 transition-smooth"
                        rel="noreferrer noopener"
                        href="https://github.com/PumPum7">
                        Pum
                    </a>{" "}
                    |{" "}
                    <a
                        className="link hover:text-indigo-600 transition-smooth"
                        rel="noreferrer noopener"
                        href="https://github.com/PumPum7/url-shortener">
                        GitHub
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
