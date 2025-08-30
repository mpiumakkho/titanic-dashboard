export interface TitanicRow {
  PassengerId?: number;
  Survived?: number; // 0 or 1
  Pclass?: number; // 1,2,3
  Name?: string;
  Sex?: "male" | "female" | string;
  Age?: number | null;
  SibSp?: number;
  Parch?: number;
  Ticket?: string;
  Fare?: number | null;
  Cabin?: string | null;
  Embarked?: string | null; // C, Q, S
  [key: string]: unknown;
}

export interface CommentItem {
  id: string;
  text: string;
  author: string;
  createdAt: string; // ISO string
  updatedAt?: string; // ISO string
}


