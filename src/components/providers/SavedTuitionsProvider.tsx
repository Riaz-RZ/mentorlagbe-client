"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { apiGet } from "@/lib/api";
import { apiPost, apiDelete, isPlanLimitError } from "@/lib/actions";

// Only the fields the bookmark needs.
interface SavedTuition {
    _id: string;
}

interface SavedTuitionsContextValue {
    savedIds: string[];
    loaded: boolean;
    isSaved: (id: string) => boolean;
    toggleSave: (tuition: SavedTuition) => Promise<void>;
}

const SavedTuitionsContext = createContext<SavedTuitionsContextValue | null>(
    null
);

// =============================================================
// Keeps the logged-in student's saved (bookmarked) tuition ids in
// one place so TuitionCard and the Saved Tuitions page agree.
// =============================================================
export function SavedTuitionsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    // Saved ids + the email they were loaded for (null = nothing loaded).
    const [stored, setStored] = useState<{
        email: string;
        ids: string[];
    } | null>(null);

    const email = session?.user?.email;
    // Better Auth types role as "student" | "tutor" (admin lives in the DB).
    const role = session?.user?.role as string | undefined;

    // Only students have a saved list.
    const activeEmail =
        !isPending && email && role === "student" ? email : null;

    // Load my saved ids whenever the signed-in student changes.
    useEffect(() => {
        if (!activeEmail) return;

        let cancelled = false;

        const load = async () => {
            try {
                const tuitions = await apiGet<{ _id: string }[]>(
                    `/api/saved?studentEmail=${encodeURIComponent(activeEmail)}`
                );
                if (!cancelled) {
                    setStored({
                        email: activeEmail,
                        ids: tuitions.map((t) => t._id),
                    });
                }
            } catch {
                // Leave ids empty - the bookmark button still works.
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [activeEmail]);

    // Derived state: ids only count for the current student (so a
    // logout or account switch never shows another user's bookmarks).
    const savedIds =
        stored && stored.email === activeEmail ? stored.ids : [];
    const loaded =
        activeEmail === null || stored?.email === activeEmail;

    const isSaved = (id: string) => savedIds.includes(id);

    // Save / unsave with the required toast messages.
    const toggleSave = async (tuition: SavedTuition) => {
        if (!email) {
            toast.error("Please log in to save tuitions");
            return;
        }
        if (role !== "student") {
            toast.error("Only students can save tuitions");
            return;
        }

        const alreadySaved = savedIds.includes(tuition._id);

        try {
            if (alreadySaved) {
                await apiDelete(
                    `/api/saved?tuitionId=${encodeURIComponent(tuition._id)}&studentEmail=${encodeURIComponent(email)}`
                );
                setStored({
                    email,
                    ids: savedIds.filter((id) => id !== tuition._id),
                });
                toast.success("Tuition removed from saved");
            } else {
                await apiPost("/api/saved", {
                    tuitionId: tuition._id,
                    studentEmail: email,
                });
                setStored({ email, ids: [...savedIds, tuition._id] });
                toast.success("Tuition saved successfully");
            }
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Something went wrong"
            );
            // Free-plan limit (5 bookmarks) -> show the pricing page.
            if (isPlanLimitError(error)) router.push("/pricing");
        }
    };

    return (
        <SavedTuitionsContext.Provider
            value={{ savedIds, loaded, isSaved, toggleSave }}
        >
            {children}
        </SavedTuitionsContext.Provider>
    );
}

export function useSavedTuitions() {
    const ctx = useContext(SavedTuitionsContext);
    if (!ctx) {
        throw new Error(
            "useSavedTuitions must be used inside SavedTuitionsProvider"
        );
    }
    return ctx;
}
