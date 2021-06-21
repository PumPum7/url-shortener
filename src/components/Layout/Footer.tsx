export const Footer = (): JSX.Element => {
    return (
        <footer className="flex mt-6 py-6 h-16 bg-gray-200">
            <div className="mx-auto max-w-sm md:max-w-2xl lg:max-w-screen-md">
                <p>
                    Made with 💚 by{" "}
                    <a
                        className="link"
                        rel="noreferrer noopener"
                        href="https://github.com/PumPum7">
                        Pum
                    </a>{" "}
                    |{" "}
                    <a
                        className="link"
                        rel="noreferrer noopener"
                        href="https://github.com/PumPum7/url-shortener">
                        Github
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
