"use client";

import CommentSection from "@/components/CommentSection";
import type { TitanicRow } from "@/types/titanic";
import { Card, Typography } from "@/ui";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function compute(rows: TitanicRow[]) {
  const groups = [
    { key: "No", filter: (r: TitanicRow) => (r.SibSp ?? 0) === 0 },
    { key: "Yes", filter: (r: TitanicRow) => (r.SibSp ?? 0) > 0 },
  ];
  return groups.map((g) => {
    const subset = rows.filter(g.filter);
    const total = subset.length || 1;
    const survived = subset.filter((r) => r.Survived === 1).length;
    const rate = Math.round((survived / total) * 100);
    return { HasSiblingSpouseAboard: g.key, SurvivalRate: rate };
  });
}

export default function SurvivalWithSibSp({ rows, note }: { rows: TitanicRow[]; note?: string }) {
  const t = useTranslations('charts.survivalWithSibSp');
  const l = useTranslations('labels');
  const tc = useTranslations('comments');
  const data = compute(rows);
  return (
    <Card title={t('title')} bordered>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="HasSiblingSpouseAboard" tickFormatter={(v) => v === 'Yes' ? l('yes') : l('no')} />
            <YAxis unit="%" />
            <Tooltip formatter={(value: number) => [`${value}`, l('survivalRate')]} />
            <Legend />
            <Bar dataKey="SurvivalRate" name={l('survivalRate')} fill="#1677ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {note ? (
        <div className="mt-3"><Typography.Paragraph>{note}</Typography.Paragraph></div>
      ) : null}
      <div className="mt-4">
        <CommentSection storageKey="chart:survival-with-sibsp" title={tc('title')} />
      </div>
    </Card>
  );
}


