"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SpecialtyBarChartProps {
    data: {
        name: string
        consultas: number
    }[]
}

export function SpecialtyBarChart({ data }: SpecialtyBarChartProps) {
    return (
        <Card className="col-span-12 md:col-span-6 lg:col-span-7">
            <CardHeader>
                <CardTitle>Consultas por Especialidad</CardTitle>
                <CardDescription>
                    Especialidades más demandadas
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                            <XAxis type="number" stroke="#888888" fontSize={12} />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#888888"
                                fontSize={12}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: 'var(--muted)' }}
                                contentStyle={{
                                    backgroundColor: 'var(--background)',
                                    borderColor: 'var(--border)',
                                    borderRadius: '0.5rem'
                                }}
                                itemStyle={{ color: 'var(--foreground)' }}
                            />
                            <Bar
                                dataKey="consultas"
                                fill="hsl(var(--primary))"
                                radius={[0, 4, 4, 0]}
                                barSize={32}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
