"use client";

import Image from "next/image";
import Link from "next/link";
import { authClient } from "@lib/auth-client";

import React from "react";
import { redirect } from "next/navigation";

import ScissorLogo from "../../../public/assets/scissor.png";

export const Header = (): React.ReactElement => {
    const { data: session, isPending } = authClient.useSession();

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
                        {isPending ? (
                            <li className="hidden md:block">Loading...</li>
                        ) : session ? (
                            <li className="hidden md:block hover:text-indigo-600">
                                <button
                                    onClick={() => {
                                        authClient.signOut();
                                        redirect("/");
                                    }}>
                                    Logout
                                </button>
                            </li>
                        ) : null}
                        <li className="px-4 text-white py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md hover:shadow-lg transition-transform transform hover:-translate-y-1">
                            {session ? (
                                <Link href="/dashboard">
                                    {session.user.name || session.user.email}
                                </Link>
                            ) : (
                                <Link href="/login">Sign up</Link>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
