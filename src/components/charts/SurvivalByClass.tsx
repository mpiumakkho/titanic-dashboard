"use client";

import CommentSection from "@/components/CommentSection";
import type { TitanicRow } from "@/types/titanic";
import { Card, Typography } from "@/ui";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function aggregate(rows: TitanicRow[]) {
  const cls: Record<string, { survived: number; notSurvived: number }> = {};
  for (const row of rows) {
    const p = row.Pclass == null ? "Unknown" : String(row.Pclass);
    if (!cls[p]) cls[p] = { survived: 0, notSurvived: 0 };
    if (row.Survived === 1) cls[p].survived += 1;
    else if (row.Survived === 0) cls[p].notSurvived += 1;
  }
  return Object.entries(cls)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, v]) => ({ name, Survived: v.survived, NotSurvived: v.notSurvived }));
}

export default function SurvivalByClass({ rows, note }: { rows: TitanicRow[]; note?: string }) {
  const t = useTranslations('charts.survivalByClass');
  const l = useTranslations('labels');
  const tc = useTranslations('comments');
  const data = aggregate(rows);
  return (
    <Card title={t('title')} bordered>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value: number, name) => [String(value), name === 'Survived' ? l('survived') : l('notSurvived')]} />
            <Legend />
            <Bar dataKey="Survived" name={l('survived')} fill="#1677ff" />
            <Bar dataKey="NotSurvived" name={l('notSurvived')} fill="#bfbfbf" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {note ? (
        <div className="mt-3"><Typography.Paragraph>{note}</Typography.Paragraph></div>
      ) : null}
      <div className="mt-4">
        <CommentSection storageKey="chart:survival-by-class" title={tc('title')} />
      </div>
    </Card>
  );
}


