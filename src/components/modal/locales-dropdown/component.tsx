import * as React from 'react';
import { defineMessages, IntlShape } from 'react-intl';
import { AvailableLocaleObject, WindowWithSettings } from '../../../common/types';

const DEFAULT_VALUE = 'select';
const DEFAULT_KEY = -1;

interface LocalesDropdownProps {
  allLocales: AvailableLocaleObject[];
  value: string;
  intl: IntlShape;
  handleChange: React.EventHandler<React.ChangeEvent<HTMLSelectElement>>;
  elementId: string;
  selectMessage: string;
}

const intlMessages = defineMessages({
  'en-US': {
    id: 'plugin.actionButtonDropdown.modal.dropdown.en-US',
    description: 'English language',
  },
  'de-DE': {
    id: 'plugin.actionButtonDropdown.modal.dropdown.de-DE',
    description: 'English language',
  },
  'es-ES': {
    id: 'plugin.actionButtonDropdown.modal.dropdown.es-ES',
    description: 'English language',
  },
  'fr-FR': {
    id: 'plugin.actionButtonDropdown.modal.dropdown.fr-FR',
    description: 'English language',
  },
  'hi-ID': {
    id: 'plugin.actionButtonDropdown.modal.dropdown.hi-ID',
    description: 'English language',
  },
  'it-IT': {
    id: 'plugin.actionButtonDropdown.modal.dropdown.it-IT',
    description: 'English language',
  },
  'ja-JP': {
    id: 'plugin.actionButtonDropdown.modal.dropdown.ja-JP',
    description: 'English language',
  },
  'pt-BR': {
    id: 'plugin.actionButtonDropdown.modal.dropdown.pt-BR',
    description: 'English language',
  },
  'ru-RU': {
    id: 'plugin.actionButtonDropdown.modal.dropdown.ru-RU',
    description: 'English language',
  },
  'zh-CN': {
    id: 'plugin.actionButtonDropdown.modal.dropdown.zh-CN',
    description: 'English language',
  },
});

declare const window: WindowWithSettings;

function LocalesDropdown(props: LocalesDropdownProps) {
  const {
    value, handleChange, elementId, selectMessage,
    allLocales, intl,
  } = props;
  const defaultLocale = value || DEFAULT_VALUE;

  const [availableLocales, setAvailableLocales] = React.useState<AvailableLocaleObject[]>([]);

  const filterLocaleVariations = (localeValue: string) => {
    if (allLocales) {
      if (window.meetingClientSettings.public.app.showAllAvailableLocales) {
        return allLocales;
      }

      // splits value if not empty
      const splitValue = (localeValue) ? localeValue.split('-')[0] : '';

      const allLocaleCodes: string[] = [];
      allLocales.map((item) => allLocaleCodes.push(item.locale));

      return allLocales.filter(
        (locale) => (!locale.locale.includes('-') || locale.locale.split('-')[0] === splitValue || !allLocaleCodes.includes(locale.locale.split('-')[0])),
      );
    }
    return [];
  };
  React.useEffect(() => {
    setAvailableLocales(filterLocaleVariations(value));
  }, [allLocales]);
  return (
    <select
      id={elementId}
      onChange={handleChange}
      value={defaultLocale}
    >
      <option disabled key={DEFAULT_KEY} value={DEFAULT_VALUE}>
        {selectMessage}
      </option>
      {availableLocales.map((localeItem) => (
        <option key={localeItem.locale} value={localeItem.locale} lang={localeItem.locale}>
          {intl.formatMessage(intlMessages[localeItem.locale])}
        </option>
      ))}
    </select>
  );
}

export default LocalesDropdown;
