"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface ComplianceChartProps {
    score: number;
}

export function ComplianceChart({ score }: ComplianceChartProps) {
    const data = [
        { name: "Compliant", value: score },
        { name: "Pending", value: 100 - score },
    ];

    const COLORS = ["#1d4ed8", "#e2e8f0"]; // Blue and Light Gray

    return (
        <div className="relative w-48 h-48 flex items-center justify-center">
            <ResponsiveContainer width={180} height={180}>
                <PieChart>
                    <Pie
                        data={data}
                        innerRadius={65}
                        outerRadius={80}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={8}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* Absolute center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{score}%</span>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest mt-0.5">TOTAL</span>
            </div>
        </div>
    );
}
