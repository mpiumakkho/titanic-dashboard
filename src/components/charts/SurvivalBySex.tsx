"use client";

import CommentSection from "@/components/CommentSection";
import type { TitanicRow } from "@/types/titanic";
import { Card, Typography } from "@/ui";
import { useTranslations } from "next-intl";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Categorical palette for sex (not survival semantics)
const COLORS = ["#1677ff", "#722ED1", "#8c8c8c"]; // blue, purple, gray

function aggregate(rows: TitanicRow[]) {
  const sexToCounts: Record<string, { survived: number; notSurvived: number }> = {};
  for (const row of rows) {
    const rawSex = (row.Sex || "unknown").toString();
    const sex = rawSex === 'male' ? 'Male' : rawSex === 'female' ? 'Female' : 'Unknown';
    if (!sexToCounts[sex]) sexToCounts[sex] = { survived: 0, notSurvived: 0 };
    if (row.Survived === 1) sexToCounts[sex].survived += 1;
    else if (row.Survived === 0) sexToCounts[sex].notSurvived += 1;
  }
  return Object.entries(sexToCounts).map(([sex, v]) => ({
    name: sex,
    value: v.survived,
    notSurvived: v.notSurvived,
  }));
}

export default function SurvivalBySex({ rows, note }: { rows: TitanicRow[]; note?: string }) {
  const t = useTranslations('charts.survivalBySex');
  const l = useTranslations('labels');
  const tc = useTranslations('comments');
  const data = aggregate(rows);
  const localized = data.map((d) => ({
    ...d,
    label: d.name === 'Male' ? l('male') : d.name === 'Female' ? l('female') : l('unknown')
  }));
  const total = data.reduce((sum, d) => sum + d.value + (d.notSurvived ?? 0), 0);

  return (
    <Card title={t('title')} bordered>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Legend />
            <Pie dataKey="value" nameKey="label" data={localized} cx="50%" cy="50%" outerRadius={90} label>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${value}`, l('survived')]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-500">{t('total', { total })}</div>
      {note ? (
        <div className="mt-3"><Typography.Paragraph>{note}</Typography.Paragraph></div>
      ) : null}
      <div className="mt-4">
        <CommentSection storageKey="chart:survival-by-sex" title={tc('title')} />
      </div>
    </Card>
  );
}


