"use client";

import CommentSection from "@/components/CommentSection";
import type { TitanicRow } from "@/types/titanic";
import { Card, Typography } from "@/ui";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function compute(rows: TitanicRow[]) {
  const map: Record<string, { female: number; male: number }> = {};
  for (const r of rows) {
    const cls = r.Pclass == null ? "Unknown" : String(r.Pclass);
    if (!map[cls]) map[cls] = { female: 0, male: 0 };
    if (r.Survived === 1) {
      if (r.Sex === "female") map[cls].female += 1;
      if (r.Sex === "male") map[cls].male += 1;
    }
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => ({ Pclass: k, female: v.female, male: v.male }));
}

export default function SurvivalByClassAndGender({ rows, note }: { rows: TitanicRow[]; note?: string }) {
  const t = useTranslations('charts.survivalByClassAndGender');
  const l = useTranslations('labels');
  const tc = useTranslations('comments');
  const data = compute(rows);
  return (
    <Card title={t('title')} bordered>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Pclass" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="female" name={l('female')} fill="#e86aa0" />
            <Bar dataKey="male" name={l('male')} fill="#2b6cb0" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {note ? (
        <div className="mt-3"><Typography.Paragraph>{note}</Typography.Paragraph></div>
      ) : null}
      <div className="mt-4">
        <CommentSection storageKey="chart:survival-by-class-gender" title={tc('title')} />
      </div>
    </Card>
  );
}


