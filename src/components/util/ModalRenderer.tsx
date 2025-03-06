"use client";

import { useModalContext } from "@/context/GlobalContext";

export const ModalRenderer = () => {
    const { showModal, currentModal } = useModalContext();

    if (!showModal || !currentModal) {
        return null;
    }

    return currentModal;
};
