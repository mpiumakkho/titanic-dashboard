"use client";

import CommentSection from "@/components/CommentSection";
import type { TitanicRow } from "@/types/titanic";
import { Card, Typography } from "@/ui";
import { useTranslations } from "next-intl";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function SexDistribution({ rows, note }: { rows: TitanicRow[]; note?: string }) {
  const t = useTranslations('charts.sexDistribution');
  const l = useTranslations('labels');
  const tc = useTranslations('comments');
  const male = rows.filter((r) => r.Sex === "male").length;
  const female = rows.filter((r) => r.Sex === "female").length;
  const data = [
    { name: l('male'), value: male, color: "#2b6cb0" },
    { name: l('female'), value: female, color: "#e86aa0" },
  ];
  return (
    <Card title={t('title')} bordered>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <PieChart>
            <Legend />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} label>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {note ? (
        <div className="mt-3"><Typography.Paragraph>{note}</Typography.Paragraph></div>
      ) : null}
      <div className="mt-4">
        <CommentSection storageKey="chart:sex-distribution" title={tc('title')} />
      </div>
    </Card>
  );
}


