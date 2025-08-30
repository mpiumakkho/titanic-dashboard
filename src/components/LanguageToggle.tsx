"use client";

import { Button } from "@/ui";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";

export default function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams() as { locale?: string };
  const current = (params?.locale as string) || 'en';
  const next = current === 'en' ? 'th' : 'en';

  const handleClick = () => {
    const stripped = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');
    const qs = searchParams?.toString();
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    router.replace(`/${next}${stripped}${qs ? `?${qs}` : ''}${hash}`);
  };

  return <Button onClick={handleClick}>{next.toUpperCase()}</Button>;
}


