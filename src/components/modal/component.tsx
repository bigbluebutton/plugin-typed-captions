import * as BbbPluginSdk from 'bigbluebutton-html-plugin-sdk';
import { IntlShape } from 'react-intl';
import * as React from 'react';
import Styled from './styles';
import LocalesDropdown from './locales-dropdown/component';
import './styles.css';
import { AVAILABLE_LOCALES, CAPTIONS_CONFIG_LANGUAGES } from './constants';
import { AvailableLocaleObject, CaptionMenu } from '../../common/types';
import { intlMessages } from '../../intlMessages';

interface TypedCaptionsModalProps {
  isOpen: boolean;
  intl: IntlShape;
  onRequestClose: () => void;
  setIsOpen: (value: boolean) => void;
  availableCaptionMenus: BbbPluginSdk.DataChannelEntryResponseType<CaptionMenu>[];
  pushCaptionMenu: BbbPluginSdk.PushEntryFunction<CaptionMenu>;
  captionLocale: string;
  setCaptionLocale: (value: string) => void;
  pluginApi: BbbPluginSdk.PluginApi;
}

interface LocaleProps {
  locale: string;
  name: string;
}

const TIMEOUT_RENDER_ERROR = 3000;

function TypedCaptionsModal(props: TypedCaptionsModalProps) {
  const {
    isOpen,
    onRequestClose,
    setIsOpen,
    availableCaptionMenus,
    pushCaptionMenu,
    captionLocale: locale,
    setCaptionLocale: setLocale,
    pluginApi,
    intl,
  } = props;

  const [availableLocales, setAvailableLocales] = React.useState<AvailableLocaleObject[]>([]);
  const [errorMessage, setErrorMessage] = React.useState('');

  React.useEffect(() => {
    const localeFilter = (l: LocaleProps) => CAPTIONS_CONFIG_LANGUAGES.includes(l?.locale);
    const filteredLocales = AVAILABLE_LOCALES.filter(localeFilter);
    setAvailableLocales(filteredLocales as AvailableLocaleObject[]);

    return () => {
      setIsOpen(false);
      setAvailableLocales([]);
    };
  }, []);

  const setError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, TIMEOUT_RENDER_ERROR);
  };

  const handleStart: React.MouseEventHandler<HTMLButtonElement> = () => {
    const alreadyUsedEntryId = availableCaptionMenus?.filter(
      (item) => item.payloadJson.captionLocale === locale,
    )[0]?.entryId;
    if (locale !== '' && !alreadyUsedEntryId) {
      pluginApi.serverCommands.caption.addLocale(locale);
      pushCaptionMenu({ captionLocale: locale });
      setIsOpen(false);
    } else if (locale === '') {
      setError('Please select a language!');
    } else if (alreadyUsedEntryId) {
      setError('This language is already in the typed-captions menu');
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleChange: React.EventHandler<React.ChangeEvent<HTMLSelectElement>> = (event) => {
    setLocale(event.target.value);
  };

  if (!intl) return null;
  const selectorLabel = intl.formatMessage(intlMessages.selectorLabel);
  return (
    <Styled.TypedCaptionsModal
      overlayClassName="modal-overlay"
      {...{
        isOpen,
        onRequestClose,
        setIsOpen,
      }}
    >
      <Styled.CloseButton
        type="button"
        className="clickable-close"
        onClick={() => {
          handleCloseModal();
        }}
      >
        <i
          className="icon-bbb-close"
        />
      </Styled.CloseButton>
      <Styled.Content>
        <span>
          {selectorLabel}
        </span>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label
          htmlFor="captionsLangSelector"
        />
        <Styled.WriterMenuSelect>
          <LocalesDropdown
            allLocales={availableLocales}
            handleChange={handleChange}
            value={locale}
            elementId="captionsLangSelector"
            intl={intl}
            selectMessage={intl.formatMessage(intlMessages.selectPlaceholder)}
          />
        </Styled.WriterMenuSelect>
        {errorMessage ?? (
          <Styled.ErrorLabel>
            {errorMessage}
          </Styled.ErrorLabel>
        )}
        <Styled.StartBtn
          type="button"
          onClick={(e) => { handleStart(e); }}
        >
          {intl.formatMessage(intlMessages.startButtonLabel)}
        </Styled.StartBtn>
      </Styled.Content>
    </Styled.TypedCaptionsModal>
  );
}

export { TypedCaptionsModal };
