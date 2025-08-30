"use client";

import CommentSection from "@/components/CommentSection";
import type { TitanicRow } from "@/types/titanic";
import { Card, Table, Typography } from "@/ui";
import { useTranslations } from "next-intl";

function pearson(x: number[], y: number[]) {
  const n = x.length;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX; const dy = y[i] - meanY;
    num += dx * dy; denX += dx * dx; denY += dy * dy;
  }
  const denom = Math.sqrt(denX * denY) || 1;
  return num / denom;
}

export default function CorrelationTable({ rows, note }: { rows: TitanicRow[]; note?: string }) {
  const t = useTranslations('charts.pearson');
  const tc = useTranslations('comments');
  const values = rows
    .map((r) => ({ Age: r.Age ?? null, Fare: r.Fare ?? null, Pclass: r.Pclass ?? null, Survived: r.Survived ?? null }))
    .filter((r) => r.Age !== null && r.Fare !== null && r.Pclass !== null && r.Survived !== null) as Array<{
      Age: number; Fare: number; Pclass: number; Survived: number;
    }>;

  const pairs = [
    ["Age", "Fare"],
    ["Age", "Pclass"],
    ["Age", "Survived"],
    ["Fare", "Pclass"],
    ["Fare", "Survived"],
    ["Pclass", "Survived"],
  ] as const;

  function series(key: "Age" | "Fare" | "Pclass" | "Survived"): number[] {
    return values.map((v) => v[key]);
  }

  const data = pairs.map(([a, b], idx) => ({
    key: String(idx),
    pair: `${a} vs ${b}`,
    coefficient: Math.round(pearson(series(a), series(b)) * 100) / 100,
  }));

  return (
    <Card title={t('title')} bordered>
      <Table
        pagination={false}
        rowClassName={() => "correlation-row"}
        className="correlation-table"
        dataSource={data}
        columns={[
          { title: "Pair", dataIndex: "pair" },
          { title: "Coefficient", dataIndex: "coefficient" },
        ]}
      />
      {note ? (
        <div className="mt-3"><Typography.Paragraph>{note}</Typography.Paragraph></div>
      ) : null}
      <div className="mt-4">
        <Typography.Paragraph type="secondary">
          Values near 1/-1 indicate strong positive/negative linear relationships; near 0 indicates weak or no linear relationship.
        </Typography.Paragraph>
      </div>
      <div className="mt-4">
        <CommentSection storageKey="table:correlation" title={tc('title')} />
      </div>
    </Card>
  );
}


