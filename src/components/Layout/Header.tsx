"use client";

import Image from "next/image";
import Link from "next/link";

import { useUser } from "@auth0/nextjs-auth0/client";

import ScissorLogo from "../../../public/assets/scissor.png";
import React from "react";

export const Header = (): React.ReactElement  => {
    const { user, error, isLoading } = useUser();

    return (
        <div className="mx-auto px-3 py-6 max-w-(--breakpoint-lg)">
            <div className="flex flex-wrap items-center justify-between">
                <div>
                    <Link href="/" passHref>
                        <span className="inline-flex items-center text-gray-900 text-xl font-semibold md:text-3xl">
                            <Image
                                src={ScissorLogo}
                                width="44"
                                height="44"
                                alt="Logo image"
                            />
                            <h1 className="pl-2">URL Shortener</h1>
                        </span>
                    </Link>
                </div>
                <nav>
                    <ul className="flex items-center text-gray-800 text-xl font-medium">
                        <li className="hidden mr-5 hover:border-b-2 hover:border-blue-400 md:block">
                            <a
                                href="https://github.com/PumPum7/url-shortener"
                                target="_blank"
                                rel="noreferrer">
                                GitHub
                            </a>
                        </li>
                        {isLoading ? (
                            <li className="hidden mr-5 hover:border-b-2 hover:border-blue-400 md:block">
                                Loading...
                            </li>
                        ) : error ? (
                            <li className="hidden mr-5 hover:border-b-2 hover:border-blue-400 md:block">
                                Error
                            </li>
                        ) : user && (
                            <li className="hidden mr-5 hover:border-b-2 hover:border-blue-400 md:block">
                                <Link href="/api/auth/logout">
                                    Logout
                                </Link>
                            </li>
                        )}
                        <li className="px-3 py-2 bg-linear-to-r rounded-md hover:shadow-md from-blue-400 to-indigo-400 hover:cursor-pointer transform duration-300 hover:scale-[1.10]">
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
        </div>
    );
};

export default Header;
