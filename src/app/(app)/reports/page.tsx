"use client";

import { BarChart, Bar, ResponsiveContainer } from "recharts";
import { ArrowLeft, Calendar, FileText, CheckCircle, TrendingUp, TrendingDown, Clock, Users } from "lucide-react";
import Link from "next/link";

const mockTrendData = [
    { day: "01", score: 65 },
    { day: "05", score: 75 },
    { day: "10", score: 70 },
    { day: "15", score: 85 },
    { day: "20", score: 68 },
    { day: "25", score: 95 },
    { day: "27", score: 80 },
    { day: "30", score: 92 },
];

export default function ReportsPage() {
    return (
        <div className="space-y-6 pt-2 pb-24 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-blue-600">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Relatórios Detalhados</h1>
            </div>

            {/* Date Range Selector */}
            <button className="w-full card-panel p-4 py-3 flex items-center justify-between text-slate-800 font-bold hover:bg-slate-50 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                <span className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Últimos 30 dias
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                    <path d="m9 18 6-6-6-6" />
                </svg>
            </button>

            {/* Main Stats */}
            <div className="card-panel p-5">
                <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">
                    TAXA DE CONFORMIDADE GERAL
                </p>
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-900">94.2%</span>
                    <span className="flex items-center text-xs font-bold text-emerald-500">
                        <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +2.5%
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="card-panel p-5">
                    <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">
                        TAREFAS
                    </p>
                    <p className="text-2xl font-black text-slate-900 mb-1">1,240</p>
                    <p className="text-[10px] font-bold text-red-500">-1.2% vs mês ant.</p>
                </div>
                <div className="card-panel p-5">
                    <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">
                        MÉDIA ATRASO
                    </p>
                    <p className="text-2xl font-black text-slate-900 mb-1">12 min</p>
                    <p className="text-[10px] font-bold text-emerald-500">+5% melhoria</p>
                </div>
            </div>

            {/* Trend Chart (Bar Chart styled like mockup string bars) */}
            <div className="mt-8">
                <h3 className="text-base font-bold text-slate-900 mb-4">Tendência de Conformidade</h3>
                <div className="h-40 w-full bg-slate-50 rounded-xl relative p-4 flex items-end">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockTrendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <Bar
                                dataKey="score"
                                fill="#3b82f6"
                                radius={[4, 4, 4, 4]}
                                barSize={8}
                                activeBar={{ fill: '#1d4ed8' }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 px-1">
                    <span>01 Out</span>
                    <span>10 Out</span>
                    <span>20 Out</span>
                    <span>30 Out</span>
                </div>
            </div>

            {/* Sector Breakdown */}
            <div className="mt-8">
                <h3 className="text-base font-bold text-slate-900 mb-6">Conformidade por Setor</h3>
                <div className="space-y-4">
                    <ProgressBar label="Cozinha" value={98} color="bg-blue-600" />
                    <ProgressBar label="Atendimento" value={92} color="bg-blue-600" />
                    <ProgressBar label="Estoque" value={85} color="bg-blue-600" />
                    <ProgressBar label="Limpeza" value={78} color="bg-amber-500" />
                </div>
            </div>

            {/* Team Highlights */}
            <div className="mt-10">
                <h3 className="text-base font-bold text-slate-900 mb-4">Destaques da Equipe</h3>
                <div className="space-y-3">
                    <div className="card-panel p-4 flex items-center justify-between border border-blue-100 bg-blue-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Cozinha (Matutino)</h4>
                                <p className="text-xs text-slate-500 font-medium">Setor com maior nota de<br />conformidade</p>
                            </div>
                        </div>
                        <span className="text-lg font-black text-blue-600">10/10</span>
                    </div>

                    <div className="card-panel p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Ricardo Silva</h4>
                                <p className="text-xs text-slate-500 font-medium">Maior número de checklists concluídos</p>
                            </div>
                        </div>
                        <span className="text-lg font-black text-slate-900">142</span>
                    </div>
                </div>
            </div>

        </div>
    );
}

function ProgressBar({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div>
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-800">{label}</span>
                <span className="text-sm font-black text-slate-900">{value}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}
