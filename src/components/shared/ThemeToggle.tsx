
"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

function useIsMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );
}

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const mounted = useIsMounted();

    if (!mounted) {
        return (
            <Button
                variant="outline"
                size="icon"
                disabled
                aria-label="Toggle theme"
            >
                <Sun className="size-5" />
            </Button>
        );
    }

    const isDark = theme === "dark";

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="rounded-full border-slate-200 transition-colors hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
            {isDark ? (
                <Sun className="size-5 text-amber-400" />
            ) : (
                <Moon className="size-5 text-blue-600" />
            )}
        </Button>
    );
}
