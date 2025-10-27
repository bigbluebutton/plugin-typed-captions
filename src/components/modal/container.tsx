import * as BbbPluginSdk from 'bigbluebutton-html-plugin-sdk';
import { IntlShape } from 'react-intl';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useActionsButtonManager } from './hooks';
import { TypedCaptionsModalComponent } from './component';
import { AVAILABLE_LOCALES, CAPTIONS_CONFIG_LANGUAGES } from './constants';
import { AvailableLocaleObject, ActiveCaptionMenuInformation } from '../../common/types';

interface TypedCaptionsModalContainerProps {
  intl: IntlShape;
  localeMessagesLoading: boolean;
  pluginApi: BbbPluginSdk.PluginApi;
}

const TIMEOUT_RENDER_ERROR = 3000;

function TypedCaptionsModalContainer(props: TypedCaptionsModalContainerProps) {
  const {
    pluginApi,
    intl,
    localeMessagesLoading,
  } = props;

  const {
    isModalOpen,
    onRequestClose,
  } = useActionsButtonManager(
    pluginApi,
    intl,
    localeMessagesLoading,
  );

  const {
    data: activeCaptionMenusResponseFromDataChannel,
    pushEntry: pushActiveCaptionMenu,
  } = pluginApi.useDataChannel!<ActiveCaptionMenuInformation>('typed-captions-data-channel', BbbPluginSdk.DataChannelTypes.ALL_ITEMS, 'caption-menus');

  const availableCaptionMenus = activeCaptionMenusResponseFromDataChannel?.data || [];

  const currentUser = pluginApi.useCurrentUser!();

  const userId = currentUser?.data?.userId || '';

  const [captionLocale, setCaptionLocale] = useState('');

  const [availableLocales, setAvailableLocales] = React.useState<AvailableLocaleObject[]>([]);
  const [errorMessage, setErrorMessage] = React.useState('');

  useEffect(() => {
    const filteredLocales = AVAILABLE_LOCALES.filter(
      (l) => CAPTIONS_CONFIG_LANGUAGES.includes(l?.locale),
    );
    setAvailableLocales(filteredLocales as AvailableLocaleObject[]);

    return () => {
      onRequestClose();
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
      (item) => item.payloadJson.captionLocale === captionLocale,
    )[0]?.entryId;
    if (captionLocale !== '' && !alreadyUsedEntryId) {
      pluginApi.serverCommands!.caption.addLocale(captionLocale);
      pushActiveCaptionMenu({
        captionLocale,
        userId,
      });
      onRequestClose();
    } else if (captionLocale === '') {
      setError('Please select a language!');
    } else if (alreadyUsedEntryId) {
      setError('This language is already in the typed-captions menu');
    }
  };

  const handleChange: React.EventHandler<React.ChangeEvent<HTMLSelectElement>> = (event) => {
    setCaptionLocale(event.target.value);
  };

  return (
    <TypedCaptionsModalComponent
      isOpen={isModalOpen}
      onRequestClose={onRequestClose}
      intl={intl}
      handleChange={handleChange}
      availableLocales={availableLocales}
      captionLocale={captionLocale}
      errorMessage={errorMessage}
      handleStart={handleStart}
    />
  );
}

export { TypedCaptionsModalContainer };
