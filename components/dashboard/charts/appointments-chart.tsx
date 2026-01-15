"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AppointmentsChartProps {
    data: {
        name: string
        citas: number
    }[]
}

export function AppointmentsChart({ data }: AppointmentsChartProps) {
    return (
        <Card className="col-span-12 lg:col-span-7">
            <CardHeader>
                <CardTitle>Citas por Mes</CardTitle>
                <CardDescription>
                    Tendencia de citas durante el año actual
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--background)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                itemStyle={{ color: 'var(--foreground)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="citas"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
