import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'th'],
  defaultLocale: 'en',
  localeDetection: false
});

export const config = {
  matcher: ['/((?!_next|.*\..*).*)']
};


