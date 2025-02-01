import { create } from "zustand";

import { createShortURL, getUserUrls } from "@functions/urlHandlers";

import { URL } from "@interfaces";
import React from "react";

interface ModalStore {
    showModal: boolean;
    currentModal: React.ReactElement | undefined;
    setModal: (modal: React.ReactElement) => void;
    removeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
    showModal: true,
    currentModal: undefined,
    setModal: (modal: React.ReactElement) =>
        set(() => ({
            showModal: true,
            currentModal: modal,
        })),
    removeModal: () =>
        set(() => ({
            showModal: false,
            currentModal: undefined,
        })),
}));

interface UrlStore {
    urls: URL[];
    total: number;
    addUrls: (urls: URL[]) => void;
    addUrl: (
        longURL: string,
        password: string,
        expiration: number,
        length: number,
        message: string,
        customAddress: string
    ) => Promise<any>;
    removeUrl: (url: string) => void;
    updateUrl: (shortUrl: string, newUrlShort: string) => void;
}

export const useUrlStore = create<UrlStore>((set, get) => ({
    urls: [
        {
            short: "",
            long: "",
            usage: 0,
            password: "",
            protected: false,
        },
    ],
    total: 0,
    addUrls: (urls: URL[]) =>
        set((oldState) => ({
            urls: [...oldState.urls, ...urls],
            total: oldState.total + urls.length,
        })),
    addUrl: async (
        longURL,
        password = "",
        expiration = 0,
        length = 5,
        message = "",
        customAddress = ""
    ) => {
        let result = (await createShortURL(
            longURL,
            password,
            expiration,
            length,
            message,
            customAddress
        )) as URL;
        if (!("error" in result)) {
            const newUrl: URL = {
                short: result.short,
                long: result.long,
                usage: result.usage,
                password: result.password,
                protected: !!result.password,
            };
            set((oldState) => {
                let newUrlList = oldState.urls;
                newUrlList.unshift(newUrl);
                return {
                    urls: newUrlList,
                };
            });
        }
        return result;
    },
    removeUrl: async (shortUrl: string) => {
        set((oldState) => {
            let newUrlList = oldState.urls;
            const urlIndex = getUrlIndex(shortUrl, newUrlList);
            if (urlIndex > -1) {
                newUrlList.splice(urlIndex, 1);
            }
            return {
                urls: newUrlList,
                total: oldState.total - 1,
            };
        });
    },
    updateUrl: (shortUrl: string, newUrlShort: string) => {
        set((oldState) => {
            let newUrlList = [...oldState.urls];
            const urlIndex = getUrlIndex(shortUrl, newUrlList);
            if (urlIndex > -1) {
                newUrlList[urlIndex] = {
                    short: newUrlShort,
                    long: oldState.urls[urlIndex].long,
                    usage: oldState.urls[urlIndex].usage,
                };
            }
            return {
                ...oldState,
                urls: newUrlList,
            };
        });
    },
}));

const getUrlIndex = (shortUrl: string, urlList: URL[]): number => {
    for (let i = 0; i < urlList.length; i++) {
        if (urlList[i].short == shortUrl) {
            return i;
        }
    }
    return -1;
};
