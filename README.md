## Titanic Dashboard

Single-page interactive dashboard for the Titanic dataset. Upload the provided CSV to see insights and leave comments on each card or chart.

### Tech
- Next.js App Router (TypeScript)
- Ant Design (UI) + Tailwind
- Recharts (charts)
- PapaParse (CSV parsing)

### Features
- Upload the Titanic CSV (processed locally, not uploaded)
- Summary cards: total records, survivors, non-survivors
- Charts: Survival by Sex, Survival by Class, Age Distribution
- Per-card comment sections with add/edit/delete (stored in localStorage)

  **ลองใช้งานได้ที่นี่: [Titanic Dashboard](https://titanic-dashboard.vercel.app)**

### Getting Started
1. Install dependencies
```bash
npm install
```
2. Run the development server
```bash
npm run dev
```
3. Open `http://localhost:3000` and upload the dataset file (e.g., `Titanic Dataset.csv`).

### Project Structure
- `src/components/TitanicDashboard.tsx`: Main dashboard
- `src/components/charts/*`: Chart components
- `src/components/CommentSection.tsx`: Reusable comments UI backed by localStorage
- `src/lib/csv.ts`: CSV parser and sanitization
- `src/types/titanic.ts`: Types

### Notes
- Data privacy: The file is parsed entirely in the browser; nothing is sent to a server.
- Comment storage is per-card and persisted in the browser via `localStorage`.

### Build
```bash
npm run build && npm start
```
