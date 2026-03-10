import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navigation from "@/components/navigation";
import { Toaster } from "react-hot-toast";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    if (session.user.role === "SUPERADMIN") {
        redirect("/superadmin");
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Toaster position="top-right" />
            <Navigation />
            <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
                <div className="max-w-2xl mx-auto md:max-w-5xl px-4 md:px-8 py-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
