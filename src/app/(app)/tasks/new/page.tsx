"use client";

import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { createTask, getCompanyUsers } from "../actions";

export default function NewTaskPage() {
    const router = useRouter();
    interface FormValues {
        title: string;
        description: string;
        type: string;
        sectorId: string;
        priority: string;
        recurrence: string;
        dueDate: string;
        dueTime: string;
        assigneeId?: string;
    }

    const { register, handleSubmit, watch } = useForm<FormValues>({
        defaultValues: {
            type: "sector",
            priority: "medium",
            recurrence: "once",
        }
    });

    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<{ id: string, name: string | null }[]>([]);

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            await createTask(data);
            toast.success("Tarefa criada com sucesso!");
            router.push("/tasks");
        } catch (error: any) {
            toast.error(error.message || "Erro ao criar tarefa");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCompanyUsers().then(fetchedUsers => setUsers(fetchedUsers)).catch(console.error);
    }, []);

    const assignmentType = watch("type");
    const priority = watch("priority");
    const recurrence = watch("recurrence");

    return (
        <div className="space-y-6 pt-2 pb-24 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/tasks" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-800">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Nova Tarefa</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-lg">

                {/* Título */}
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Título da Tarefa</label>
                    <input
                        {...register("title", { required: true })}
                        className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-sm"
                        placeholder="Ex: Limpeza da Coifa"
                    />
                </div>

                {/* Descrição */}
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Descrição/Instruções</label>
                    <textarea
                        {...register("description")}
                        rows={4}
                        className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-sm resize-none"
                        placeholder="Descreva os detalhes da tarefa..."
                    />
                </div>

                {/* Tipo de Atribuição (Toggle Button) */}
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Tipo de Atribuição</label>
                    <div className="flex p-1 bg-slate-50/80 rounded-xl border border-slate-200">
                        <label className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-colors ${assignmentType === 'sector' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100'}`}>
                            <input type="radio" value="sector" {...register("type")} className="hidden" />
                            Por Setor
                        </label>
                        <label className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-colors ${assignmentType === 'nominal' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100'}`}>
                            <input type="radio" value="nominal" {...register("type")} className="hidden" />
                            Nominal
                        </label>
                    </div>
                </div>

                {/* Atribuição Condicional (Setor ou Pessoa) */}
                {assignmentType === 'sector' ? (
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Selecionar Setor</label>
                        <select
                            {...register("sectorId")}
                            className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-sm appearance-none bg-no-repeat bg-[center_right_1rem] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')]"
                        >
                            <option value="cozinha">Cozinha</option>
                            <option value="atendimento">Atendimento</option>
                            <option value="estoque">Estoque</option>
                        </select>
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Selecionar Funcionário</label>
                        <select
                            {...register("assigneeId")}
                            className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-sm appearance-none bg-no-repeat bg-[center_right_1rem] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')]"
                        >
                            <option value="">Atribuir para mim mesmo</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name || "Sem Nome"}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Prioridade (Toggle Buttons 3 Options) */}
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Prioridade</label>
                    <div className="grid grid-cols-3 gap-3">
                        <label className={`text-center py-2.5 rounded-xl border-2 cursor-pointer transition-colors ${priority === 'low' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-100 bg-white text-slate-600 font-semibold hover:border-slate-200'}`}>
                            <input type="radio" value="low" {...register("priority")} className="hidden" />
                            Baixa
                        </label>
                        <label className={`text-center py-2.5 rounded-xl border-2 cursor-pointer transition-colors ${priority === 'medium' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-100 bg-white text-slate-600 font-semibold hover:border-slate-200'}`}>
                            <input type="radio" value="medium" {...register("priority")} className="hidden" />
                            Média
                        </label>
                        <label className={`text-center py-2.5 rounded-xl border-2 cursor-pointer transition-colors ${priority === 'high' ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-100 bg-white text-slate-600 font-semibold hover:border-slate-200'}`}>
                            <input type="radio" value="high" {...register("priority")} className="hidden" />
                            Alta
                        </label>
                    </div>
                </div>

                {/* Recorrência */}
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Recorrência</label>
                    <div className="flex p-1 bg-slate-50/80 rounded-xl border border-slate-200">
                        <label className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-colors ${recurrence === 'once' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100'}`}>
                            <input type="radio" value="once" {...register("recurrence")} className="hidden" />
                            Pontual
                        </label>
                        <label className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-colors ${recurrence === 'recurring' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100'}`}>
                            <input type="radio" value="recurring" {...register("recurrence")} className="hidden" />
                            Recorrente
                        </label>
                    </div>
                </div>

                {/* Data Limite / Horário */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Data Limite</label>
                        <input
                            type="date"
                            {...register("dueDate")}
                            className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Horário</label>
                        <input
                            type="time"
                            {...register("dueTime")}
                            className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-sm"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    Criar Tarefa
                </button>
            </form>
        </div>
    );
}
