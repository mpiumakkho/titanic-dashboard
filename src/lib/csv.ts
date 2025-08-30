import type { TitanicRow } from "@/types/titanic";
import Papa from "papaparse";

export function parseTitanicCsv(csvText: string): TitanicRow[] {
  const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  const rows = (result.data as Record<string, string>[]).map((raw) => sanitizeRow(raw));
  return rows;
}

function toNumber(value: string | undefined): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function sanitizeRow(raw: Record<string, string>): TitanicRow {
  return {
    PassengerId: toNumber(raw.PassengerId) ?? undefined,
    Survived: toNumber(raw.Survived) ?? undefined,
    Pclass: toNumber(raw.Pclass) ?? undefined,
    Name: raw.Name,
    Sex: (raw.Sex as TitanicRow["Sex"]) ?? undefined,
    Age: toNumber(raw.Age),
    SibSp: toNumber(raw.SibSp) ?? undefined,
    Parch: toNumber(raw.Parch) ?? undefined,
    Ticket: raw.Ticket,
    Fare: toNumber(raw.Fare),
    Cabin: raw.Cabin || null,
    Embarked: raw.Embarked || null,
  };
}


