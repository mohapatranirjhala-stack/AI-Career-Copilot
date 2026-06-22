
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function SkillsBarChart({
  skills,
}: {
  skills: string[];
}) {

  const skillData =
    skills.map(
      (skill) => ({
        name: skill,
        value: 100,
      })
    );

  return (
    <BarChart
      width={500}
      height={250}
      data={skillData}
    >
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />

      <Bar
        dataKey="value"
        fill="#2563eb"
      />
    </BarChart>
  );
}