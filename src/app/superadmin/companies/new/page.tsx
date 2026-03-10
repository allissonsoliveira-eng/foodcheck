"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Building2, User } from "lucide-react";

export default function NewCompanyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch("/api/superadmin/companies", {
                method: "POST",
                body: JSON.stringify({
                    companyName: formData.get("companyName"),
                    adminName: formData.get("adminName"),
                    adminEmail: formData.get("adminEmail"),
                    adminPassword: formData.get("adminPassword"),
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Ocorreu um erro ao criar a empresa.");
            }

            router.push("/superadmin");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href="/superadmin"
                    className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cadastrar Nova Empresa</h1>
                    <p className="text-slate-500 text-sm mt-1">Crie um novo ambiente de checklist na plataforma.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 md:p-8 space-y-8">
                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center">
                            {error}
                        </div>
                    )}

                    {/* Dados da Empresa */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <Building2 className="w-5 h-5 text-blue-500" />
                            <h2 className="text-lg font-semibold text-slate-800">Dados da Empresa</h2>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="companyName">
                                Nome do Estabelecimento (SaaS)
                            </label>
                            <input
                                id="companyName"
                                name="companyName"
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="Restaurante Central Ltda"
                            />
                        </div>
                    </div>

                    {/* Administrador Principal */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <User className="w-5 h-5 text-blue-500" />
                            <h2 className="text-lg font-semibold text-slate-800">Administrador Principal</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="adminName">
                                    Nome do Admin
                                </label>
                                <input
                                    id="adminName"
                                    name="adminName"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    placeholder="João Silva"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="adminEmail">
                                    E-mail de Login
                                </label>
                                <input
                                    id="adminEmail"
                                    name="adminEmail"
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    placeholder="joao@central.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="adminPassword">
                                Senha Temporária
                            </label>
                            <input
                                id="adminPassword"
                                name="adminPassword"
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-slate-500 mt-2 font-medium">O administrador usará esta senha para seu primeiro acesso.</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                    <Link
                        href="/superadmin"
                        className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-600/20"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Criar Empresa"}
                    </button>
                </div>
            </form>
        </div>
    );
}
