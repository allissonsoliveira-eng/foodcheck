import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Building, Users } from "lucide-react";

export default async function SuperadminDashboard() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "SUPERADMIN") {
        redirect("/login");
    }

    const companies = await prisma.company.findMany({
        include: {
            _count: {
                select: { users: true, sectors: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Empresas Cadastradas</h1>
                    <p className="text-slate-500 text-sm mt-1">Gerencie os clientes e estabelecimentos da plataforma.</p>
                </div>

                <Link
                    href="/superadmin/companies/new"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nova Empresa
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Empresa</th>
                                <th className="px-6 py-4">Criada em</th>
                                <th className="px-6 py-4 text-center">Usuários</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {companies.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        Nenhuma empresa cadastrada ainda.
                                    </td>
                                </tr>
                            ) : (
                                companies.map((company) => (
                                    <tr key={company.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                                                    <Building className="w-5 h-5" />
                                                </div>
                                                <span className="font-semibold text-slate-900">{company.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(company.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full w-max mx-auto">
                                                <Users className="w-4 h-4" />
                                                <span className="font-medium text-xs">{company._count.users}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {/* Future management actions like edit, ban, or view details could go here */}
                                            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                                                Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
