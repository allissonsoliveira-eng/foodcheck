import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { LogOut, Building, ShieldCheck } from "lucide-react";

export default async function SuperadminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    if (session.user.role !== "SUPERADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen border-r border-slate-800">
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="font-bold tracking-tight">Superadmin</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    <Link href="/superadmin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-600 font-semibold shadow-sm">
                        <Building className="w-4 h-4" />
                        Empresas
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="mb-4 px-3">
                        <p className="text-sm font-semibold truncate">{session.user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
                    </div>

                    <Link href="/api/auth/signout" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Sair do Painel
                    </Link>
                </div>
            </aside>

            {/* Mobile Nav Top */}
            <div className="md:hidden fixed top-0 w-full bg-slate-900 text-white p-4 flex items-center justify-between z-10 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <span className="font-bold">Superadmin</span>
                </div>
                <Link href="/api/auth/signout" className="text-slate-400 hover:text-white">
                    <LogOut className="w-5 h-5" />
                </Link>
            </div>

            <main className="flex-1 overflow-y-auto mt-14 md:mt-0 p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
