"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface Props {
    title: string;
    data: any[];
    dataKey: string;
}


export function MetricCard({ title, data, dataKey }: Props) {
    return (
        <div className="rounded-xl border bg-gray-700 shadow-sm">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-slate-500">
                    {data.length ? "Last updated metrics" : "No data available"}
                </p>
            </div>

            <div className="p-4 h-[320px]">
                {data.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ts" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey={dataKey} strokeWidth={2.5} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400">
                        No data
                    </div>
                )}
            </div>
        </div>
    );
}
