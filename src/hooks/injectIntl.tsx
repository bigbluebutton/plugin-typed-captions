import { createIntl } from 'react-intl';
import { PluginApi, IntlLocaleUiDataNames } from 'bigbluebutton-html-plugin-sdk';
import * as React from 'react';

const localesContext = require.context('@locales', true, /\.json$/);

export const useInjectIntl = <P extends object>(WrappedComponent: React.ComponentType<P>, pluginApi: PluginApi) => function injectIntl(props: Omit<P, 'intl' | 'pluginApi'>) {
  const currentLocale = pluginApi.useUiData(IntlLocaleUiDataNames.CURRENT_LOCALE, {
    locale: 'en',
    fallbackLocale: 'en',
  });

  let messages = [];
  try {
    messages = localesContext(`./${currentLocale.locale}.json`);
  } catch {
    messages = localesContext(`./${currentLocale.fallbackLocale}.json`);
  }

  const intl = createIntl({
    locale: currentLocale.locale,
    messages,
    fallbackOnEmptyString: true,
  });

  return <WrappedComponent {...props as P} intl={intl} pluginApi={pluginApi} />;
};
