"use client";

import CommentSection from "@/components/CommentSection";
import type { TitanicRow } from "@/types/titanic";
import { Card, Typography } from "@/ui";
import { useTranslations } from "next-intl";

// Simple correlation heatmap using HTML/CSS grid (numeric variables only)
function pearson(x: number[], y: number[]) {
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let denX = 0;
  let denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const denom = Math.sqrt(denX * denY) || 1;
  return num / denom;
}

function format(num: number) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export default function CorrelationHeatmap({ rows, note }: { rows: TitanicRow[]; note?: string }) {
  const t = useTranslations('charts.correlationHeatmap');
  const tc = useTranslations('comments');
  const values = rows
    .map((r) => ({ Age: r.Age ?? null, Fare: r.Fare ?? null, Pclass: r.Pclass ?? null, Survived: r.Survived ?? null }))
    .filter((r) => r.Age !== null && r.Fare !== null && r.Pclass !== null && r.Survived !== null) as Array<{
      Age: number; Fare: number; Pclass: number; Survived: number;
    }>;

  const cols = ["Age", "Fare", "Pclass", "Survived"] as const;
  const series: Record<typeof cols[number], number[]> = {
    Age: values.map((v) => v.Age),
    Fare: values.map((v) => v.Fare),
    Pclass: values.map((v) => v.Pclass),
    Survived: values.map((v) => v.Survived),
  };

  const matrix: number[][] = cols.map((a) => cols.map((b) => pearson(series[a], series[b])));

  function colorFor(v: number) {
    // blue scale -1 .. 1
    const t = (v + 1) / 2; // 0..1
    const r = 230 - Math.round(130 * t);
    const g = 240 - Math.round(160 * t);
    const b = 255 - Math.round(255 * (1 - t));
    return `rgb(${r},${g},${b})`;
  }

  return (
    <Card title={t('title')} bordered>
      <div style={{ display: "grid", gridTemplateColumns: `120px repeat(${cols.length}, 1fr)`, gap: 4 }}>
        <div />
        {cols.map((c) => (
          <div key={`h-${c}`} style={{ textAlign: "center", fontWeight: 600 }}>{c}</div>
        ))}
        {cols.map((rowKey, i) => (
          <>
            <div key={`r-${rowKey}`} style={{ fontWeight: 600 }}>{rowKey}</div>
            {cols.map((colKey, j) => (
              <div key={`c-${i}-${j}`} style={{ background: colorFor(matrix[i][j]), padding: 12, textAlign: "center", borderRadius: 4 }}>
                {format(matrix[i][j])}
              </div>
            ))}
          </>
        ))}
      </div>
      {note ? (
        <div className="mt-3"><Typography.Paragraph>{note}</Typography.Paragraph></div>
      ) : null}
      <div className="mt-4">
        <CommentSection storageKey="chart:correlation-heatmap" title={tc('title')} />
      </div>
    </Card>
  );
}


