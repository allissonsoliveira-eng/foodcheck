import Link from "next/link";
import {
    Home,
    CheckSquare,
    Users,
    Settings,
    BarChart2,
    LogOut
} from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Navigation() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const role = session.user.role;
    const isManagerOrAdmin = role === "ADMIN" || role === "MANAGER";

    return (
        <>
            {/* Sidebar (Desktop Only) */}
            <div className="hidden md:flex flex-col w-64 h-screen border-r border-slate-200 bg-white sticky top-0 p-4">
                <div className="flex items-center gap-3 mb-10 px-2 mt-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M5 21H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 leading-tight tracking-tight">Gourmet Bistro</h1>
                        <p className="text-xs text-slate-500 font-medium tracking-wide">Main Street Branch</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Home className="w-5 h-5" />
                        Início
                    </Link>
                    <Link href="/tasks" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <CheckSquare className="w-5 h-5" />
                        Checklists
                    </Link>

                    {isManagerOrAdmin && (
                        <>
                            <Link href="/reports" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                <BarChart2 className="w-5 h-5" />
                                Relatórios
                            </Link>
                            <Link href="/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                <Users className="w-5 h-5" />
                                Equipe
                            </Link>
                        </>
                    )}
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Settings className="w-5 h-5" />
                        Ajustes
                    </Link>
                </nav>

                <div className="mt-auto pt-4 border-t border-slate-100">
                    <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-5 h-5" />
                        Sair ({session.user.name?.split(' ')[0]})
                    </Link>
                </div>
            </div>

            {/* Bottom Navigation (Mobile Only) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-center justify-between z-50">
                <Link href="/dashboard" className="flex flex-col items-center gap-1 p-2 text-blue-600">
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Início</span>
                </Link>
                <Link href="/tasks" className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <CheckSquare className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Checklists</span>
                </Link>

                {isManagerOrAdmin && (
                    <>
                        <Link href="/users" className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-blue-600 transition-colors">
                            <Users className="w-6 h-6" />
                            <span className="text-[10px] font-bold">Equipe</span>
                        </Link>
                        <Link href="/reports" className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-blue-600 transition-colors">
                            <BarChart2 className="w-6 h-6" />
                            <span className="text-[10px] font-bold">Relatórios</span>
                        </Link>
                    </>
                )}
                <Link href="/settings" className="flex flex-col items-center gap-1 p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Ajustes</span>
                </Link>
            </div>
        </>
    );
}
