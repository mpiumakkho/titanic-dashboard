import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';
import { notFound } from 'next/navigation';
import en from '../../messages/en.json';
import th from '../../messages/th.json';
import '../globals.css';

export default async function LocaleLayout({
  children,
  params: { locale }
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
  const messagesByLocale: Record<string, AbstractIntlMessages> = {
    en: en as unknown as AbstractIntlMessages,
    th: th as unknown as AbstractIntlMessages
  };
  const messages = messagesByLocale[locale];
  if (!messages) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages} now={new Date()} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}


