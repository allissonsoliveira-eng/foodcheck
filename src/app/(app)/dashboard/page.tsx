import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ComplianceChart } from "@/components/compliance-chart";
import { AlertTriangle, Clock, CheckSquare } from "lucide-react";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) return null;

    const { companyId, sectorId, role } = session.user;
    const isManagerOrAdmin = role === "ADMIN" || role === "MANAGER";

    // Data queries
    const totalTasks = await prisma.task.count({
        where: { companyId: companyId as string, ...(sectorId && !isManagerOrAdmin ? { sectorId } : {}) }
    });

    const completedTasks = await prisma.task.count({
        where: { companyId: companyId as string, status: "COMPLETED", ...(sectorId && !isManagerOrAdmin ? { sectorId } : {}) }
    });

    const pendingTasks = totalTasks - completedTasks;
    const complianceScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // For the Mockup Sector list breakdown
    const sectors = await prisma.sector.findMany({
        where: { companyId: companyId as string }
    });

    // Simplified manual percentage for sectors to match UI mockup (would normally be queried per sector)
    const sectorMocks = [
        { name: "Cozinha", score: 92, color: "bg-blue-600" },
        { name: "Salão", score: 75, color: "bg-slate-300" },
        { name: "Estoque", score: 84, color: "bg-slate-400" },
    ];

    return (
        <div className="space-y-4 pt-0 pb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

            {/* Header Topic */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase">Visão Geral Hoje</h2>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold">Atualizado há 2m</span>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-3 gap-2">
                <div className="card-panel p-4 flex flex-col justify-between">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Concluídas</p>
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black text-slate-800">{completedTasks}</span>
                        <span className="text-[10px] font-bold text-emerald-500">+5%</span>
                    </div>
                </div>

                <div className="card-panel p-4 flex flex-col justify-between">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Pendentes</p>
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black text-slate-800">{pendingTasks}</span>
                        <span className="text-[10px] font-bold text-amber-500">45%</span>
                    </div>
                </div>

                <div className="card-panel p-4 flex flex-col justify-between border-l-4 border-l-red-500">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Atrasadas</p>
                    <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black text-red-500">3</span>
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Main Compliance Panel */}
            <div className="card-panel p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Conformidade por Setor</h3>

                <div className="flex flex-col md:flex-row items-center gap-8 justify-center pb-2">
                    {/* Circular Chart */}
                    <ComplianceChart score={complianceScore} />

                    {/* Sector List Legend */}
                    <div className="flex flex-col gap-4 w-full max-w-[200px]">
                        {sectorMocks.map(s => (
                            <div key={s.name} className="flex items-start gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${s.color}`} />
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{s.name}</p>
                                    <p className="text-xs font-medium text-slate-500">{s.score}% Conformidade</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Minhas Tarefas Section (Mockup bottom part) */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Minhas Tarefas</h2>
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Ver tudo</button>
                </div>

                <div className="space-y-3">
                    {/* Hardcoded mock tasks to fit the visual of the user's mockup */}
                    <TaskCardMock
                        title="Registro Temp. Geladeira"
                        time="Vence às 11:00"
                        status="PENDENTE"
                        iconType="warning"
                    />
                    <TaskCardMock
                        title="Check de Higiene das Mãos"
                        time="Concluído às 8:45"
                        status="OK"
                        iconType="success"
                    />
                    <TaskCardMock
                        title="Limpeza Pesada da Grelha"
                        time="Atrasada (9:00)"
                        status="ATRASADA"
                        iconType="danger"
                    />
                </div>
            </div>
        </div>
    );
}

// Helper to mimic the exact UI of the mockups temporarily
function TaskCardMock({ title, time, status, iconType }: { title: string, time: string, status: string, iconType: 'warning' | 'success' | 'danger' }) {

    const iconConfig = {
        warning: { bg: 'bg-amber-100', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
        success: { bg: 'bg-emerald-100', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
        danger: { bg: 'bg-red-100', text: 'text-red-500', badge: 'bg-red-100 text-red-600' }
    };

    const style = iconConfig[iconType];

    return (
        <div className="card-panel p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.bg} ${style.text}`}>
                    {iconType === 'warning' && <Clock className="w-6 h-6" />}
                    {iconType === 'success' && <CheckSquare className="w-6 h-6" />}
                    {iconType === 'danger' && <AlertTriangle className="w-6 h-6" />}
                </div>
                <div>
                    <h4 className="font-bold text-slate-800">{title}</h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{time}</p>
                </div>
            </div>
            <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest ${style.badge}`}>
                {status}
            </div>
        </div>
    );
}
