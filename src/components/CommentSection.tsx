"use client";

import type { CommentItem } from "@/types/titanic";
import { Button, Input, List, Modal, Space, Typography } from "@/ui";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

interface CommentSectionProps {
  storageKey: string; // unique per card
  title?: string;
}

export default function CommentSection({ storageKey, title }: CommentSectionProps) {
  const t = useTranslations('comments');
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [draft, setDraft] = useState<string>("");
  const [editing, setEditing] = useState<CommentItem | null>(null);
  const [editText, setEditText] = useState<string>("");

  // Ensure namespacing per card
  const localStorageKey = useMemo(() => `comments:${storageKey}`, [storageKey]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(localStorageKey);
      if (raw) setComments(JSON.parse(raw));
    } catch {}
  }, [localStorageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(comments));
    } catch {}
  }, [comments, localStorageKey]);

  const randomNames = [
    "Alex", "Taylor", "Jordan", "Casey", "Morgan", "Riley", "Sam", "Cameron", "Jamie", "Avery",
  ];

  function addComment() {
    const text = draft.trim();
    if (!text) return;
    const newItem: CommentItem = {
      id: crypto.randomUUID(),
      text,
      author: randomNames[Math.floor(Math.random() * randomNames.length)],
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [newItem, ...prev]);
    setDraft("");
  }

  function removeComment(id: string) {
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  function beginEdit(item: CommentItem) {
    setEditing(item);
    setEditText(item.text);
  }

  function saveEdit() {
    if (!editing) return;
    const text = editText.trim();
    if (!text) return;
    setComments((prev) =>
      prev.map((c) => (c.id === editing.id ? { ...c, text, updatedAt: new Date().toISOString() } : c))
    );
    setEditing(null);
    setEditText("");
  }

  return (
    <div className="w-full">
      {title ? (
        <Typography.Title level={5} style={{ marginBottom: 12 }}>
          {title}
        </Typography.Title>
      ) : null}
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input.TextArea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t('placeholder')}
          autoSize={{ minRows: 2, maxRows: 4 }}
        />
        <Button type="primary" onClick={addComment} disabled={!draft.trim()}>
          {t('add')}
        </Button>
        <List
          locale={{ emptyText: t('empty') }}
          dataSource={comments}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key="edit" type="link" onClick={() => beginEdit(item)}>
                  {t('edit')}
                </Button>,
                <Button key="delete" type="link" danger onClick={() => removeComment(item.id)}>
                  {t('delete')}
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span>
                    <strong>{item.author}</strong> · {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
                    {item.updatedAt ? ` (edited ${dayjs(item.updatedAt).format("DD/MM/YYYY HH:mm")})` : ""}
                  </span>
                }
                description={<Typography.Paragraph style={{ marginBottom: 0 }}>{item.text}</Typography.Paragraph>}
              />
            </List.Item>
          )}
        />
      </Space>

      <Modal
        open={!!editing}
        title={t('modalEdit')}
        onOk={saveEdit}
        onCancel={() => setEditing(null)}
        okText={t('save')}
      >
        <Input.TextArea value={editText} onChange={(e) => setEditText(e.target.value)} autoSize />
      </Modal>
    </div>
  );
}


