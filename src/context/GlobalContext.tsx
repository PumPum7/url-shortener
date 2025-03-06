"use client";

import { createShortURL } from "@functions/urlHandlers";
import { URL } from "@interfaces";

import React, {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useState,
} from "react";

// Modal Context
interface ModalContextType {
    showModal: boolean;
    currentModal: React.ReactElement | undefined;
    setModal: (modal: React.ReactElement) => void;
    removeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [currentModal, setCurrentModal] = useState<
        React.ReactElement | undefined
    >(undefined);

    const setModal = useCallback((modal: React.ReactElement) => {
        setShowModal(true);
        setCurrentModal(modal);
    }, []);

    const removeModal = useCallback(() => {
        setShowModal(false);
        setCurrentModal(undefined);
    }, []);

    return (
        <ModalContext.Provider
            value={{ showModal, currentModal, setModal, removeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModalContext = (): ModalContextType => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModalContext must be used within a ModalProvider");
    }
    return context;
};

// URL Context
interface UrlContextType {
    urls: URL[];
    total: number;
    addUrls: (urls: URL[]) => void;
    addUrl: (
        longURL: string,
        password?: string,
        expiration?: number,
        length?: number,
        message?: string,
        customAddress?: string,
        isAdded?: boolean
    ) => Promise<any>;
    removeUrl: (shortUrl: string) => void;
    updateUrl: (shortUrl: string, newUrlShort: string) => void;
}

const UrlContext = createContext<UrlContextType | undefined>(undefined);

export const UrlProvider = ({ children }: { children: ReactNode }) => {
    const [urls, setUrls] = useState<URL[]>([]);
    const [total, setTotal] = useState<number>(0);

    const addUrls = useCallback((newUrls: URL[]) => {
        setUrls((prev) => [...prev, ...newUrls]);
        setTotal((prevTotal) => prevTotal + newUrls.length);
    }, []);

    const addUrl = useCallback(
        async (
            longURL: string,
            password: string = "",
            expiration: number = 0,
            length: number = 5,
            message: string = "",
            customAddress: string = "",
            isAdded: boolean = false
        ) => {
            const result = !isAdded
                ? await createShortURL(
                      longURL,
                      password,
                      expiration,
                      length,
                      message,
                      customAddress
                  )
                : {
                      short: customAddress,
                      long: longURL,
                      usage: 0,
                      password: password,
                  };
            if (result && typeof result === "object" && !("error" in result)) {
                let typedresult = result as {
                    short: string;
                    long: string;
                    usage: number;
                    password: string;
                };
                const newUrl: URL = {
                    short: typedresult.short,
                    long: typedresult.long,
                    usage: typedresult.usage,
                    password: typedresult.password,
                    protected: !!typedresult.password,
                };
                setUrls((prev) => [newUrl, ...prev]);
                setTotal((prevTotal) => prevTotal + 1);
            }
            return result;
        },
        []
    );

    const removeUrl = useCallback((shortUrl: string) => {
        setUrls((prev) => {
            const index = prev.findIndex((u) => u.short === shortUrl);
            if (index > -1) {
                const newUrls = [...prev];
                newUrls.splice(index, 1);
                setTotal((t) => t - 1);
                return newUrls;
            }
            return prev;
        });
    }, []);

    const updateUrl = useCallback((shortUrl: string, newUrlShort: string) => {
        setUrls((prev) =>
            prev.map((u) =>
                u.short === shortUrl ? { ...u, short: newUrlShort } : u
            )
        );
    }, []);

    return (
        <UrlContext.Provider
            value={{ urls, total, addUrls, addUrl, removeUrl, updateUrl }}>
            {children}
        </UrlContext.Provider>
    );
};

export const useUrlContext = (): UrlContextType => {
    const context = useContext(UrlContext);
    if (!context) {
        throw new Error("useUrlContext must be used within a UrlProvider");
    }
    return context;
};

// Combined Provider
export const GlobalContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    return (
        <ModalProvider>
            <UrlProvider>{children}</UrlProvider>
        </ModalProvider>
    );
};
