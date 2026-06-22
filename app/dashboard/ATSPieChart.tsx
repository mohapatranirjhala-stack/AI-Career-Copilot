
"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

export default function ATSPieChart({
  atsScore,
}: {
  atsScore: number;
}) {
  const data = [
    {
      name: "Matched",
      value: atsScore,
    },
    {
      name: "Missing",
      value: 100 - atsScore,
    },
  ];

  return (
    <PieChart
      width={280}
      height={220}
    >
      <Pie
        data={data}
        innerRadius={60}
        outerRadius={90}
        dataKey="value"
      >
        <Cell fill="#10b981" />
        <Cell fill="#ef4444" />
      </Pie>

      <Tooltip />
    </PieChart>
  );
}