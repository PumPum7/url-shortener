import Image from "next/image";

export const Header = (): JSX.Element => {
    return (
        <div className="max-w-screen-lg mx-auto px-3 py-6">
            <div className="flex flex-wrap justify-between items-center">
                <div>
                    <a href="/">
                        <span className="text-gray-900 inline-flex items-center font-semibold text-3xl">
                            <Image
                                src={"/scissors.png"}
                                width={"44"}
                                height="44"
                            />
                            URL Cutter
                        </span>
                    </a>
                </div>
                <nav className="">
                    <ul className=" navbar flex items-center font-medium text-xl text-gray-800">
                        <li className="mr-5">
                            <a
                                href="https://github.com/PumPum7/url-shortener"
                                target="_blank">
                                GitHub
                            </a>
                        </li>
                        <li>
                            <a href="/">Sign in</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Header;
