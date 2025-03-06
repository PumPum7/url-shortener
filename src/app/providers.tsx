"use client";

import React, { ReactNode } from "react";

import { GlobalContextProvider } from "@/context/GlobalContext";

export function Providers({ children }: { children: ReactNode }) {
    return <GlobalContextProvider>{children}</GlobalContextProvider>;
}
