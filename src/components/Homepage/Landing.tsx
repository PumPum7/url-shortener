import React from "react";

import Link from "next/link";

import Lottie from "react-lottie";

import * as StatsPreview from "../../../public/assets/previews/StatsPreview.json";
import * as UrlPreview from "../../../public/assets/previews/UrlPreview.json";

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
                <p className="pb-4 text-center text-gray-600">
                    Create links to fit your brand. Profit from analytics and
                    shorter link lengths.
                    <br />
                    Share links like a pro!
                </p>
                <LandingPagePreview
                    image={StatsPreview}
                    title={"Keep track of your URLs"}
                    description={
                        "Always be able to track your URLs and get access to those analytics from everywhere!"
                    }
                />
                <LandingPagePreview
                    image={UrlPreview}
                    title={"Easily share your URLs"}
                    description={
                        "Share your URLs with everyone without filling the whole chat up!"
                    }
                />
            </article>
            <article className="pt-6">
                <LandingPageHeader>Features</LandingPageHeader>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    <LandingPageFeatureShort
                        Icon={<LinkIcon className="w-8 h-8" />}
                        title="URL Shortener"
                        description="Easily shorten all your URLs for free and profit from our other features. Links will never expire!"
                    />
                    <LandingPageFeatureShort
                        Icon={<AdjustmentsIcon className="w-8 h-8" />}
                        title="Management"
                        description="Keep control of your URLs and change everything about them whenever you want!"
                    />
                    <LandingPageFeatureShort
                        Icon={<ChartPieIcon className="w-8 h-8" />}
                        title="Statistics"
                        description="Keep track of the most important statistics of your URL where and whenever you want!"
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
}): JSX.Element => {
    return <h1 className="pb-6 text-center font-bold">{children}</h1>;
};

const LandingPageFeatureShort = ({
    Icon,
    title,
    description,
}: {
    Icon: React.ReactElement;
    title: string;
    description: string;
}): JSX.Element => {
    return (
        <div className="p-4 border-2 hover:border-blue-600 border-gray-400 rounded-md">
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

const LandingPagePreview = ({
    title,
    description,
    image,
}: {
    title: string;
    description: string;
    image: any;
}): JSX.Element => {
    const LottieOptions = {
        loop: true,
        autoplay: true,
        animationData: image,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <div className="flex flex-col-reverse items-center pt-6 md:flex-row md:last-of-type:flex-row-reverse">
            <div className="pb-6 md:pb-0 md:py-6">
                <h1 className="pl-2 text-2xl md:pl-0">{title}</h1>
                <p className="pl-2 py-3 md:pl-0">{description}</p>
                <Link href={"/api/auth/login"}>
                    <a className="block px-1 px-3 py-2 w-full text-center text-blue-600 hover:text-white font-bold hover:bg-blue-600 border-2 border-blue-600 rounded-full md:px-0 md:w-1/2">
                        Sign up
                    </a>
                </Link>
            </div>
            <Lottie options={LottieOptions} height={300} width={300} />
        </div>
    );
};
