"use client";

import CommentSection from "@/components/CommentSection";
import type { TitanicRow } from "@/types/titanic";
import { Card, Table, Typography } from "@/ui";
import { useTranslations } from "next-intl";

function rank(values: number[]): number[] {
  const indexed = values.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const ranks: number[] = new Array(values.length);
  let i = 0;
  while (i < indexed.length) {
    let j = i;
    while (j + 1 < indexed.length && indexed[j + 1].v === indexed[i].v) j++;
    const avgRank = (i + j + 2) / 2; // ranks are 1-based
    for (let k = i; k <= j; k++) ranks[indexed[k].i] = avgRank;
    i = j + 1;
  }
  return ranks;
}

function spearman(x: number[], y: number[]) {
  if (x.length !== y.length || x.length === 0) return 0;
  const rx = rank(x);
  const ry = rank(y);
  const n = x.length;
  const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / n;
  const mx = mean(rx), my = mean(ry);
  let num = 0, denx = 0, deny = 0;
  for (let i = 0; i < n; i++) {
    const dx = rx[i] - mx; const dy = ry[i] - my;
    num += dx * dy; denx += dx * dx; deny += dy * dy;
  }
  const denom = Math.sqrt(denx * deny) || 1;
  return num / denom;
}

export default function SpearmanTable({ rows, note }: { rows: TitanicRow[]; note?: string }) {
  const t = useTranslations('charts.spearman');
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
    coefficient: Math.round(spearman(series(a), series(b)) * 100) / 100,
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
        <CommentSection storageKey="table:spearman" title={tc('title')} />
      </div>
    </Card>
  );
}


