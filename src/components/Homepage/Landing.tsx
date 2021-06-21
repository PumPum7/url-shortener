import React from "react";

import Link from "next/link";

import {
    AdjustmentsIcon,
    ChartPieIcon,
    LinkIcon,
} from "@components/util/Icons";

export const Landingpage = (): JSX.Element => {
    return (
        <section className="pt-6">
            <article>
                <LandingPageHeader>
                    Short urls, custom urls and more!
                </LandingPageHeader>
                <p className="pb-4 pt-6 text-center text-gray-600">
                    Create links to fit your brand. Profit from analytics and
                    shorter link lengths.
                    <br />
                    Share links like a pro!
                </p>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    <LandingPageFeature
                        Icon={<LinkIcon className="w-8 h-8" />}
                        title="URL Shortener"
                        description="Easily shorten all your URLs for free and profit from our other features. Links will never expire!"
                    />
                    <LandingPageFeature
                        Icon={<AdjustmentsIcon className="w-8 h-8" />}
                        title="Management"
                        description="Keep control of your URLs and change everything about them whenever you want!"
                    />
                    <LandingPageFeature
                        Icon={<ChartPieIcon className="w-8 h-8" />}
                        title="Statistics"
                        description="Keep track of the most important statistics of your URL where and whenever you want!"
                    />
                </div>
            </article>
            <article className="pt-6">
                <LandingPageHeader>Features</LandingPageHeader>
            </article>
        </section>
    );
};

const LandingPageHeader = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    return <h1 className="text-center font-bold">{children}</h1>;
};

const LandingPageFeature = ({
    Icon,
    title,
    description,
}: {
    Icon: React.ReactElement;
    title: string;
    description: string;
}): JSX.Element => {
    return (
        <div className="p-4 border-2 hover:border-blue-600 border-gray-400 rounded-md hover:scale-110">
            <div className="w-10 h-10 rounded-full bg-blue-400/25">
                <p className="text-center text-blue-600 transform translate-x-1 translate-y-1">
                    {Icon}
                </p>
            </div>
            <h2 className="pt-4">{title}</h2>
            <p className="pb-4">{description}</p>
            <Link href={"/api/auth/login"}>
                <a className="block px-3 py-2 w-full text-center text-blue-600 hover:text-white font-bold hover:bg-blue-600 border-2 border-blue-600 rounded-full">
                    Sign up
                </a>
            </Link>
        </div>
    );
};
