import React from "react";
import { ThemeProvider } from "@/components/theme-provider";

export default function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {children}
        </ThemeProvider>
    );
}
