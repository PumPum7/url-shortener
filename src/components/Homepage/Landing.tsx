"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
    AdjustmentsIcon,
    ChartPieIcon,
    LinkIcon,
} from "@components/util/Icons";
import { authClient } from "@lib/auth-client";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

import * as StatsPreview from "../../../public/assets/StatsAnimation.json";
import * as UrlPreview from "../../../public/assets/UrlAnimation.json";
import * as PasswordAnimation from "../../../public/assets/PasswordAnimation.json";

export const Landingpage = (): React.ReactElement => {
    const { data: session, isPending } = authClient.useSession();

    return (
        <section className="pt-6 space-y-8">
            <article>
                <LandingPageHeader>
                    Short URLs, custom links and more!
                </LandingPageHeader>
                <p className="text-center text-gray-600">
                    Create links that fit your brand. Benefit from analytics,
                    secure links, and smarter sharing.
                </p>
                <LandingPagePreview
                    image={StatsPreview}
                    title={"Track your URLs"}
                    description={
                        "Access detailed analytics and track performance from anywhere!"
                    }
                    loggedIn={session !== null}
                />
                <LandingPagePreview
                    image={UrlPreview}
                    title={"Instant Sharing"}
                    description={
                        "Share your URLs effortlessly without cluttering your chats."
                    }
                    loggedIn={session !== null}
                />
                <LandingPagePreview
                    title={"Password Protected"}
                    description={
                        "Secure your links by setting up a password for controlled access."
                    }
                    image={PasswordAnimation}
                    loggedIn={session !== null}
                />
            </article>
            <article className="pt-6">
                <LandingPageHeader>Features</LandingPageHeader>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    <LandingPageFeatureShort
                        Icon={<LinkIcon className="w-8 h-8" />}
                        title="URL Shortener"
                        description="Easily shorten your URLs for free. Links never expire!"
                        loggedIn={session !== null}
                    />
                    <LandingPageFeatureShort
                        Icon={<AdjustmentsIcon className="w-8 h-8" />}
                        title="Management"
                        description="Control and update your links anytime you want!"
                        loggedIn={session !== null}
                    />
                    <LandingPageFeatureShort
                        Icon={<ChartPieIcon className="w-8 h-8" />}
                        title="Statistics"
                        description="Monitor the most important metrics of your URLs."
                        loggedIn={session !== null}
                    />
                </div>
            </article>
        </section>
    );
};

const LandingPageHeader = ({
    children,
}: {
    children: React.ReactNode;
}): React.ReactElement => {
    return (
        <h1 className="mb-6 text-4xl font-extrabold text-center">{children}</h1>
    );
};

const LandingPageFeatureShort = ({
    Icon,
    title,
    description,
    loggedIn,
}: {
    Icon: React.ReactElement;
    title: string;
    description: string;
    loggedIn: boolean;
}): React.ReactElement => {
    return (
        <div className="p-6 border rounded-lg shadow hover:shadow-lg transition duration-300">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 mb-4">
                {Icon}
            </div>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600 mb-4">{description}</p>
            {loggedIn ? (
                <Link
                    href={"/dashboard"}
                    className="block px-4 py-2 w-full text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 md:w-1/2">
                    Dashboard
                </Link>
            ) : (
                <Link
                    href={"/login"}
                    className="block px-4 py-2 w-full text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 md:w-1/2">
                    Sign up
                </Link>
            )}
        </div>
    );
};

const LandingPagePreview = ({
    title,
    description,
    image,
    loggedIn,
}: {
    title: string;
    description: string;
    image: any;
    loggedIn: boolean;
}): React.ReactElement => {
    const LottieOptions = {
        loop: true,
        autoplay: true,
        animationData: image,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <div className="flex flex-col-reverse items-center pt-6 md:flex-row md:even:flex-row-reverse">
            <div className="pb-6 md:py-6">
                <h1 className="pl-2 text-2xl md:pl-0">{title}</h1>
                <p className="pl-2 py-3 md:pl-0">{description}</p>
                {loggedIn ? (
                    <Link
                        href={"/dashboard"}
                        className="block px-4 py-2 w-full text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 md:w-1/2">
                        Dashboard
                    </Link>
                ) : (
                    <Link
                        href={"/login"}
                        className="block px-4 py-2 w-full text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 md:w-1/2">
                        Sign up
                    </Link>
                )}
            </div>
            {/* @ts-expect-error: react-lottie has no typing */}
            <Lottie options={LottieOptions} height={300} width={300} />
        </div>
    );
};
