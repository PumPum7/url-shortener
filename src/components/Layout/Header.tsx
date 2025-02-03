"use client";

import Image from "next/image";
import Link from "next/link";

import { useUser } from "@auth0/nextjs-auth0/client";

import ScissorLogo from "../../../public/assets/scissor.png";
import React from "react";

export const Header = (): React.ReactElement  => {
    const { user, error, isLoading } = useUser();

    return (
        <header className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/" passHref>
                        <span className="inline-flex items-center text-gray-900 text-xl font-semibold md:text-3xl transition-smooth">
                            <Image
                                src={ScissorLogo}
                                width="44"
                                height="44"
                                alt="Logo image"
                            />
                            <h1 className="pl-2 my-auto">URL Shortener</h1>
                        </span>
                    </Link>
                </div>
                <nav>
                    <ul className="flex items-center space-x-4 text-gray-700 text-lg transition-smooth">
                        <li className="hidden md:block hover:text-indigo-600">
                            <a
                                href="https://github.com/PumPum7/url-shortener"
                                target="_blank"
                                rel="noreferrer">
                                GitHub
                            </a>
                        </li>
                        {isLoading ? (
                            <li className="hidden md:block">
                                Loading...
                            </li>
                        ) : error ? (
                            <li className="hidden md:block">
                                Error
                            </li>
                        ) : user && (
                            <li className="hidden md:block hover:text-indigo-600">
                                <Link href="/api/auth/logout">
                                    Logout
                                </Link>
                            </li>
                        )}
                        <li className="px-4 text-white py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
                            {user ? (
                                <Link href="/profile">
                                    {user.nickname}
                                </Link>
                            ) : (
                                <Link href="/api/auth/login">
                                    Sign up
                                </Link>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
