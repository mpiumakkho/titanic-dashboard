"use client";

import CommentSection from "@/components/CommentSection";
import type { TitanicRow } from "@/types/titanic";
import { Card, Typography } from "@/ui";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function compute(rows: TitanicRow[]) {
  const buckets: Record<string, number[]> = {};
  for (const r of rows) {
    if (typeof r.Age !== "number" || r.Pclass == null) continue;
    const key = String(r.Pclass);
    (buckets[key] ||= []).push(r.Age);
  }
  return Object.entries(buckets)
    .map(([k, arr]) => ({ Pclass: k, AverageAge: Math.round((arr.reduce((s, a) => s + a, 0) / arr.length) * 10) / 10 }))
    .sort((a, b) => Number(a.Pclass) - Number(b.Pclass));
}

export default function AverageAgeByClass({ rows, note }: { rows: TitanicRow[]; note?: string }) {
  const t = useTranslations('charts.avgAgeByClass');
  const l = useTranslations('labels');
  const tc = useTranslations('comments');
  const data = compute(rows);
  return (
    <Card title={t('title')} bordered>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Pclass" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="AverageAge" name={l('averageAge')} fill="#1677ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {note ? (
        <div className="mt-3"><Typography.Paragraph>{note}</Typography.Paragraph></div>
      ) : null}
      <div className="mt-4">
        <CommentSection storageKey="chart:avg-age-by-class" title={tc('title')} />
      </div>
    </Card>
  );
}


