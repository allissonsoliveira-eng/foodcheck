import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Search, UserPlus, MoreVertical } from "lucide-react";
import Image from "next/image";

export default async function TeamPage() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    const role = session.user.role;
    const isManagerOrAdmin = role === "ADMIN" || role === "MANAGER";

    if (!isManagerOrAdmin) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <h2 className="text-xl font-bold text-slate-800">Acesso Negado</h2>
            </div>
        );
    }

    // Fetch users from the same company
    const users = await prisma.user.findMany({
        where: { companyId: session.user.companyId },
        include: { sector: true },
        orderBy: { role: 'asc' } // ADMINs first conceptually
    });

    // Mock roles parsing (matching Mockup terminology)
    const getRoleName = (r: string) => {
        switch (r) {
            case 'ADMIN': return 'Administrador';
            case 'MANAGER': return 'Líder de Setor';
            default: return 'Funcionário';
        }
    };

    // Status dot mocking based on mockups
    const getStatusColor = (userRole: string) => {
        return userRole === 'ADMIN' || userRole === 'MANAGER' ? 'bg-emerald-500' : 'bg-slate-300';
    };

    return (
        <div className="space-y-6 pt-2 pb-24 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-800">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gerenciar Equipe</h1>
                </div>
                <button className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/30">
                    <UserPlus className="w-5 h-5" />
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar por nome ou cargo..."
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100/80 border-none text-slate-800 rounded-2xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                />
            </div>

            {/* Filters Base */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <button className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm shadow-blue-600/20 whitespace-nowrap">
                    Todos
                </button>
                <select className="bg-white border border-slate-200 text-slate-700 text-sm font-bold px-4 py-2 rounded-xl focus:ring-2 focus:border-blue-500 outline-none cursor-pointer appearance-none">
                    <option>Administrador</option>
                    <option>Líder de Setor</option>
                    <option>Funcionário</option>
                </select>
                <select className="bg-white border border-slate-200 text-slate-700 text-sm font-bold px-4 py-2 rounded-xl focus:ring-2 focus:border-blue-500 outline-none cursor-pointer appearance-none">
                    <option>Cozinha</option>
                    <option>Atendimento</option>
                    <option>Estoque</option>
                </select>
            </div>

            {/* Users List */}
            <div className="space-y-3">
                {users.map((user) => (
                    <div key={user.id} className="card-panel p-4 flex items-center justify-between group hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                {/* Fallback to UI avatar placeholders matching the concept */}
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                                    {user.name.charAt(0)}
                                </div>
                                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusColor(user.role)}`} />
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-800 text-base leading-tight mb-0.5">{user.name}</h3>
                                <p className="text-sm text-slate-500 font-medium">
                                    {getRoleName(user.role)} • {user.role === 'ADMIN' ? 'Todos os setores' : user.sector?.name || 'Geral'}
                                </p>
                            </div>
                        </div>

                        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                ))}

                {/* Mocks so local db matches exact pictures if user didn't seed users exactly like mockup ones */}
                <MockUserCard name="Ricardo Silva" role="Administrador" sector="Todos os setores" status="active" />
                <MockUserCard name="Maria Souza" role="Líder de Setor" sector="Cozinha" status="active" />
                <MockUserCard name="João Pedro" role="Funcionário" sector="Salão" status="offline" />
                <MockUserCard name="Ana Costa" role="Líder de Setor" sector="Estoque" status="active" />
                <MockUserCard name="Carlos Lima" role="Funcionário" sector="Cozinha" status="offline" />
            </div>

        </div>
    );
}

// Temporary Mock to visually represent the 2nd mockup accurately before full realistic DB population
function MockUserCard({ name, role, sector, status }: { name: string, role: string, sector: string, status: 'active' | 'offline' }) {
    return (
        <div className="card-panel p-4 flex items-center justify-between group hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
                        {name.charAt(0)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </div>

                <div>
                    <h3 className="font-bold text-slate-800 text-base leading-tight mb-0.5">{name}</h3>
                    <p className="text-sm text-slate-500 font-medium">
                        {role} • {sector}
                    </p>
                </div>
            </div>

            <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5" />
            </button>
        </div>
    );
}
