"use client";

import CommentSection from "@/components/CommentSection";
import type { TitanicRow } from "@/types/titanic";
import { Card, Typography } from "@/ui";
import { useTranslations } from "next-intl";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function OverallSurvivalDonut({ rows, note }: { rows: TitanicRow[]; note?: string }) {
  const t = useTranslations('charts.overallDonut');
  const tc = useTranslations('comments');
  const l = useTranslations('labels');
  const survived = rows.filter((r) => r.Survived === 1).length;
  const non = rows.filter((r) => r.Survived === 0).length;
  const data = [
    { name: l('survived'), value: survived, color: "#1677ff" },
    { name: l('notSurvived'), value: non, color: "#bfbfbf" },
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
        <div className="mt-3">
          <Typography.Paragraph>{note}</Typography.Paragraph>
        </div>
      ) : null}
      <div className="mt-4">
        <CommentSection storageKey="chart:overall-donut" title={tc('title')} />
      </div>
    </Card>
  );
}


