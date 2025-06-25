"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Ene",
    total: 1200,
  },
  {
    name: "Feb",
    total: 2100,
  },
  {
    name: "Mar",
    total: 1800,
  },
  {
    name: "Abr",
    total: 2800,
  },
  {
    name: "May",
    total: 2000,
  },
  {
    name: "Jun",
    total: 3500,
  },
  {
    name: "Jul",
    total: 3000,
  },
  {
    name: "Ago",
    total: 4000,
  },
  {
    name: "Sep",
    total: 2500,
  },
  {
    name: "Oct",
    total: 3800,
  },
  {
    name: "Nov",
    total: 3000,
  },
  {
    name: "Dic",
    total: 4800,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
          contentStyle={{
            backgroundColor: "#011c26",
            border: "1px solid #025159",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#ffffff" }}
        />
        <Bar dataKey="total" fill="#26ffdf" radius={[4, 4, 0, 0]} className="fill-highlight" />
      </BarChart>
    </ResponsiveContainer>
  )
}
