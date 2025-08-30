"use client";

import CommentSection from "@/components/CommentSection";
import type { TitanicRow } from "@/types/titanic";
import { Card, Typography } from "@/ui";
import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function aggregate(rows: TitanicRow[]) {
  const bucketSize = 5; // 5-year bins
  const buckets: Record<string, number> = {};
  for (const row of rows) {
    if (row.Age == null) continue;
    const age = Math.floor(row.Age);
    const lower = Math.floor(age / bucketSize) * bucketSize;
    const upper = lower + bucketSize - 1;
    const key = `${lower}-${upper}`;
    buckets[key] = (buckets[key] ?? 0) + 1;
  }
  return Object.entries(buckets)
    .map(([range, count]) => ({ range, count }))
    .sort((a, b) => parseInt(a.range.split("-")[0]) - parseInt(b.range.split("-")[0]));
}

export default function AgeDistribution({ rows, note }: { rows: TitanicRow[]; note?: string }) {
  const t = useTranslations('charts.ageDistribution');
  const tc = useTranslations('comments');
  const data = aggregate(rows);
  return (
    <Card title={t('title')} bordered>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1677ff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1677ff" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="#1677ff" fillOpacity={1} fill="url(#colorCount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {note ? (
        <div className="mt-3"><Typography.Paragraph>{note}</Typography.Paragraph></div>
      ) : null}
      <div className="mt-4">
        <CommentSection storageKey="chart:age-distribution" title={tc('title')} />
      </div>
    </Card>
  );
}


