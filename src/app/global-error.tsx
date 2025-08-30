"use client";

import { Button } from "antd";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ padding: 24 }}>
          <h2>Application error</h2>
          <p>{error?.message || "Unknown error"}</p>
          <Button type="primary" onClick={() => reset()}>
            Reload
          </Button>
        </div>
      </body>
    </html>
  );
}




