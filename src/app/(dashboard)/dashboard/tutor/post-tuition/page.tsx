"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { apiPost } from "@/lib/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const initialForm = {
    title: "",
    subject: "",
    classLevel: "",
    mode: "online",
    location: "",
    monthlyFee: "",
    daysPerWeek: "",
    bannerImage: "",
    description: "",
};

const PostTuitionPage = () => {
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const [formData, setFormData] = useState(initialForm);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Same required fields the backend validates
        if (
            !formData.title.trim() ||
            !formData.subject.trim() ||
            !formData.classLevel.trim() ||
            !formData.monthlyFee
        ) {
            toast.error("Title, subject, class level and monthly fee are required.");
            return;
        }

        const user = session?.user;
        if (!user) {
            toast.error("Please sign in again.");
            router.replace("/login");
            return;
        }

        try {
            setIsSubmitting(true);

            await apiPost("/api/tuitions", {
                title: formData.title.trim(),
                subject: formData.subject.trim(),
                classLevel: formData.classLevel.trim(),
                mode: formData.mode,
                location: formData.location.trim(),
                monthlyFee: Number(formData.monthlyFee),
                daysPerWeek: Number(formData.daysPerWeek) || 0,
                bannerImage: formData.bannerImage.trim(),
                description: formData.description.trim(),
                // Temporary: backend takes these from the body until the
                // JWT middleware (verifyToken) is implemented.
                tutorName: user.name,
                tutorEmail: user.email,
            });

            toast.success("Tuition posted! It is waiting for admin approval.");

            // Go to my-tuitions to see the new post
            router.push("/dashboard/tutor/my-tuitions");
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to post tuition."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl">
            <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Post a Tuition</CardTitle>
                    <CardDescription>
                        Fill in the details below. Your post will be reviewed by an
                        admin before it becomes visible to students.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g. Math tutor for Class 9-10"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Subject + Class level */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject *</Label>
                                <Input
                                    id="subject"
                                    name="subject"
                                    placeholder="e.g. Mathematics"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="classLevel">Class Level *</Label>
                                <Input
                                    id="classLevel"
                                    name="classLevel"
                                    placeholder="e.g. Class 9-10"
                                    value={formData.classLevel}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Mode + Location */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Mode</Label>
                                <Select
                                    items={{
                                        online: "Online",
                                        offline: "Offline",
                                    }}
                                    value={formData.mode}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            mode: String(value),
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="online">Online</SelectItem>
                                        <SelectItem value="offline">Offline</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">
                                    Location {formData.mode === "offline" && "*"}
                                </Label>
                                <Input
                                    id="location"
                                    name="location"
                                    placeholder={
                                        formData.mode === "offline"
                                            ? "e.g. Dhanmondi, Dhaka"
                                            : "Not needed for online"
                                    }
                                    value={formData.location}
                                    onChange={handleChange}
                                    disabled={formData.mode === "online"}
                                />
                            </div>
                        </div>

                        {/* Fee + Days per week */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="monthlyFee">Monthly Fee (৳) *</Label>
                                <Input
                                    id="monthlyFee"
                                    name="monthlyFee"
                                    type="number"
                                    min={0}
                                    placeholder="e.g. 5000"
                                    value={formData.monthlyFee}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="daysPerWeek">Days Per Week</Label>
                                <Input
                                    id="daysPerWeek"
                                    name="daysPerWeek"
                                    type="number"
                                    min={0}
                                    max={7}
                                    placeholder="e.g. 5"
                                    value={formData.daysPerWeek}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Banner image URL (IMGBB upload comes in a later phase) */}
                        <div className="space-y-2">
                            <Label htmlFor="bannerImage">Banner Image URL</Label>
                            <Input
                                id="bannerImage"
                                name="bannerImage"
                                placeholder="https://i.ibb.co/..."
                                value={formData.bannerImage}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={4}
                                placeholder="Tell students about the tuition, syllabus, requirements..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setFormData(initialForm)}
                                disabled={isSubmitting}
                            >
                                Reset
                            </Button>

                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="size-4" />
                                        Post Tuition
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default PostTuitionPage;
