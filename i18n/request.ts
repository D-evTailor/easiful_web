import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale: string = (!locale || !['en', 'es'].includes(locale)) ? 'es' : locale;

  return {
    locale: validLocale,
    messages: (await import(`@/messages/${validLocale}.json`)).default
  };
}); 