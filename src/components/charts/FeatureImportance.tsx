"use client";

import CommentSection from "@/components/CommentSection";
import type { TitanicRow } from "@/types/titanic";
import { Card } from "@/ui";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Simple feature importance approximation using gini decrease from single decision stumps
function giniImpurity(labels: number[]): number {
  const n = labels.length || 1;
  const p1 = labels.reduce((s, v) => s + (v === 1 ? 1 : 0), 0) / n;
  const p0 = 1 - p1;
  return 1 - (p1 * p1 + p0 * p0);
}

function bestSplitGain(values: number[], labels: number[]): number {
  // sort pairs by value
  const pairs = values.map((v, i) => ({ v, y: labels[i] })).sort((a, b) => a.v - b.v);
  const xs = pairs.map((p) => p.v);
  const ys = pairs.map((p) => p.y);
  const totalGini = giniImpurity(ys);
  let bestGain = 0;
  for (let i = 1; i < xs.length; i++) {
    if (xs[i] === xs[i - 1]) continue;
    const left = ys.slice(0, i);
    const right = ys.slice(i);
    const weighted = (left.length / ys.length) * giniImpurity(left) + (right.length / ys.length) * giniImpurity(right);
    const gain = totalGini - weighted;
    if (gain > bestGain) bestGain = gain;
  }
  return bestGain;
}

export default function FeatureImportance({ rows }: { rows: TitanicRow[] }) {
  const t = useTranslations('charts.featureImportance');
  const l = useTranslations('labels');
  const clean = rows.filter((r) => r.Survived != null && r.Fare != null && r.Pclass != null);
  const y = clean.map((r) => (r.Survived as number));
  const age = clean.map((r) => (typeof r.Age === "number" ? r.Age : -1)).filter((v) => v >= 0);
  const ageY = clean.filter((r) => typeof r.Age === "number").map((r) => r.Survived as number);
  const fare = clean.map((r) => r.Fare as number);
  const pclass = clean.map((r) => r.Pclass as number);
  const sex = clean.map((r) => (r.Sex === "female" ? 1 : 0));
  const embarked = clean.map((r) => (r.Embarked === "C" ? 1 : r.Embarked === "Q" ? 2 : 3));

  const items = [
    { name: "Fare", value: bestSplitGain(fare, y) },
    { name: "Age", value: bestSplitGain(age, ageY) },
    { name: "Sex", value: bestSplitGain(sex, y) },
    { name: "Embarked", value: bestSplitGain(embarked, y) },
    { name: "Pclass", value: bestSplitGain(pclass, y) },
  ].sort((a, b) => b.value - a.value);

  return (
    <Card title={t('title')} bordered>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={items}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name={l('importance')} fill="#1677ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        <CommentSection storageKey="chart:feature-importance" title={useTranslations('comments')('title')} />
      </div>
    </Card>
  );
}


