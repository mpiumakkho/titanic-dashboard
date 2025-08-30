"use client";

import CommentSection from "@/components/CommentSection";
import type { TitanicRow } from "@/types/titanic";
import { Card, Typography } from "@/ui";
import { useTranslations } from "next-intl";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function compute(rows: TitanicRow[]) {
  const buckets = [
    { key: "0-9", min: 0, max: 9 },
    { key: "10-19", min: 10, max: 19 },
    { key: "20-29", min: 20, max: 29 },
    { key: "30-39", min: 30, max: 39 },
    { key: "40-49", min: 40, max: 49 },
    { key: "50-59", min: 50, max: 59 },
    { key: "60-69", min: 60, max: 69 },
    { key: "70+", min: 70, max: 200 },
  ];
  return buckets.map((b) => {
    const group = rows.filter((r) => typeof r.Age === "number" && r.Age! >= b.min && r.Age! <= b.max);
    const total = group.length;
    const survived = group.filter((g) => g.Survived === 1).length;
    const rate = total ? Math.round((survived / total) * 100) : 0;
    return { AgeGroup: b.key, SurvivalRate: rate };
  });
}

export default function SurvivalRateByAgeGroup({ rows, note }: { rows: TitanicRow[]; note?: string }) {
  const t = useTranslations('charts.survivalRateByAgeGroup');
  const l = useTranslations('labels');
  const tc = useTranslations('comments');
  const data = compute(rows);
  return (
    <Card title={t('title')} bordered>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="AgeGroup" />
            <YAxis unit="%" />
            <Tooltip formatter={(value: number) => [`${value}`, l('survivalRate')]} />
            <Legend />
            <Line type="monotone" dataKey="SurvivalRate" name={l('survivalRate')} stroke="#1677ff" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {note ? (
        <div className="mt-3"><Typography.Paragraph>{note}</Typography.Paragraph></div>
      ) : null}
      <div className="mt-4">
        <CommentSection storageKey="chart:survival-rate-agegroup" title={tc('title')} />
      </div>
    </Card>
  );
}


