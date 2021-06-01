import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0";

export const Header = (): JSX.Element => {
    const { user, error } = useUser();
    if (error) return <div>{error.message}</div>;

    return (
        <div className="max-w-screen-lg mx-auto px-3 py-6">
            <div className="flex flex-wrap justify-between items-center">
                <div>
                    <a href="/">
                        <span className="text-gray-900 inline-flex items-center font-semibold text-xl md:text-3xl">
                            <Image
                                src={"/scissors.png"}
                                width={"44"}
                                height={"44"}
                                alt="Logo image"
                            />
                            URL Cutter
                        </span>
                    </a>
                </div>
                <nav className="">
                    <ul className=" navbar flex items-center font-medium text-xl text-gray-800">
                        <li className="mr-5 hidden md:block">
                            <a
                                href="https://github.com/PumPum7/url-shortener"
                                target="_blank"
                                rel="noreferrer"
                                >
                                GitHub
                            </a>
                        </li>
                        {user && (
                            <li className="mr-5 hidden md:block">
                                <a href={"/api/auth/logout"}>Logout</a>
                            </li>
                        )}
                        <li className="rounded-md bg-gradient-to-r from-blue-400 to-indigo-400 py-2 px-3">
                            {user ? (
                                <a href={"/profile"}>{user.nickname}</a>
                            ) : (
                                <a href={"/api/auth/login"}>Login</a>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Header;
