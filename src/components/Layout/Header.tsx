import Image from "next/image";

import { useUser } from "@auth0/nextjs-auth0";

export const Header = (): JSX.Element => {
    const { user } = useUser();

    return (
        <div className="mx-auto px-3 py-6 max-w-screen-lg">
            <div className="flex flex-wrap items-center justify-between">
                <div>
                    <a href="/">
                        <span className="inline-flex items-center text-gray-900 text-xl font-semibold md:text-3xl">
                            <Image
                                src="/assets/scissors.png"
                                width="44"
                                height="44"
                                alt="Logo image"
                            />
                            <h1 className="pl-2">URL Shortener</h1>
                        </span>
                    </a>
                </div>
                <nav>
                    <ul className="flex items-center text-gray-800 text-xl font-medium navbar">
                        <li className="hidden mr-5 md:block">
                            <a
                                href="https://github.com/PumPum7/url-shortener"
                                target="_blank"
                                rel="noreferrer">
                                GitHub
                            </a>
                        </li>
                        {user && (
                            <li className="hidden mr-5 md:block">
                                <a href="/api/auth/logout">Logout</a>
                            </li>
                        )}
                        <li className="px-3 py-2 bg-gradient-to-r rounded-md hover:shadow-md from-blue-400 to-indigo-400 transform hover:scale-[1.10]">
                            {user ? (
                                <a href="/profile">{user.nickname}</a>
                            ) : (
                                <a href="/api/auth/login">Login</a>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Header;
