import create from "zustand";

import { AdvancedOptionsStruct } from "@interfaces";

interface ModalStore {
    showModal: boolean;
    currentModal: JSX.Element;
    setModal: (modal: JSX.Element) => void;
    removeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
    showModal: true,
    currentModal: undefined,
    setModal: (modal: JSX.Element) =>
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
