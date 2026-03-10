import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckSquare, AlertTriangle, Clock, X, CircleDashed, Check, Plus } from "lucide-react";
import Link from "next/link";
import TaskCard from "./TaskCard";
import TaskFilters from "./TaskFilters";

export default async function TasksPage(props: { searchParams?: Promise<{ [key: string]: string | undefined }> }) {
    const searchParams = await props.searchParams;
    const tab = searchParams?.tab || "minhas";
    const priority = searchParams?.priority;
    const status = searchParams?.status;
    const type = searchParams?.type;

    const session = await getServerSession(authOptions);
    if (!session) return null;

    const { companyId, sectorId, id: userId, role } = session.user;
    const isManagerOrAdmin = role === "ADMIN" || role === "MANAGER";

    // Filter rules
    const whereClause: any = {
        companyId: companyId as string,
    };

    if (priority) whereClause.priority = priority;
    if (status) whereClause.status = status;
    if (type) whereClause.type = type;

    if (tab === "minhas") {
        whereClause.assigneeId = userId;
    } else if (tab === "setor") {
        whereClause.sectorId = sectorId || userId; // if no sector, fallback
    } else if (tab === "todas" && isManagerOrAdmin) {
        // managers can see all, don't filter by user/sector
    } else {
        // default fallback security
        whereClause.OR = [
            { assigneeId: userId },
            { assigneeId: null }
        ];
        if (sectorId && !isManagerOrAdmin) {
            // Also enforce sector boundary for employees
            whereClause.sectorId = sectorId;
        }
    }

    // Buscar tarefas seguindo regras de permissão e filtros
    const tasks = await prisma.task.findMany({
        where: whereClause,
        include: {
            sector: true,
            assignee: true,
        },
        orderBy: [
            { status: 'desc' },
            { createdAt: 'desc' }
        ]
    });

    // Categorize for UI
    const highPriorityTasks = tasks.filter(t => t.priority === 'ALTA' || t.priority === 'URGENTE');
    const regularTasks = tasks.filter(t => t.priority !== 'ALTA' && t.priority !== 'URGENTE');

    return (
        <div className="space-y-6 pt-2 pb-24 animate-in fade-in duration-500 relative min-h-screen">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/20">
                        <CheckSquare className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Checklists</h1>
                </div>

                <button className="relative p-2 text-slate-800 hover:bg-slate-100 rounded-full transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                    </svg>
                    {tasks.filter(t => t.status === "PENDING").length > 0 && (
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                </button>
            </div>

            <TaskFilters />

            {/* Tasks List Content */}
            <div className="space-y-6">

                {/* Section: Alta Prioridade */}
                {highPriorityTasks.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Alta Prioridade</h3>
                            <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {highPriorityTasks.filter(t => t.status !== "COMPLETED").length} Pendentes
                            </span>
                        </div>

                        <div className="space-y-3">
                            {highPriorityTasks.map(task => (
                                <TaskCard key={task.id} task={task} isManagerOrAdmin={isManagerOrAdmin} currentUserId={userId} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Section: Regular */}
                <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Regular</h3>
                        <span className="text-slate-500 text-xs font-bold">{regularTasks.length} Tarefas</span>
                    </div>

                    <div className="space-y-3">
                        {regularTasks.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm">
                                Nenhuma tarefa regular encontrada.
                            </div>
                        ) : (
                            regularTasks.map(task => (
                                <TaskCard key={task.id} task={task} isManagerOrAdmin={isManagerOrAdmin} currentUserId={userId} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            {isManagerOrAdmin && (
                <Link href="/tasks/new" className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-600/40 hover:bg-blue-700 hover:scale-105 transition-all z-40">
                    <Plus className="w-8 h-8" />
                </Link>
            )}
        </div>
    );
}
