"use client";

import { Button } from "antd";
import { useEffect } from "react";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Something went wrong</h2>
      <p>{error?.message || "Unknown error"}</p>
      <Button type="primary" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}




