import {
  DataChannelTypes,
  GenericContentSidekickArea,
  PluginApi,
} from 'bigbluebutton-html-plugin-sdk';
import { useEffect } from 'react';
import {
  createIntl, createIntlCache, defineMessages, IntlShape,
} from 'react-intl';
import { ActiveCaptionMenuInformation } from '../common/types';
import { renderComponent } from '../components/typed-captions-panel/component';

const LOCALE_REQUEST_OBJECT = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
  ? {
    headers: {
      'ngrok-skip-browser-warning': 'any',
    },
  } : undefined;

const intlMessages = defineMessages({
  sectionName: {
    id: 'plugin.actionButtonDropdown.sidekickComponent.sectionName',
    description: 'name of the sidekick component section',
  },
  menuTitle: {
    id: 'plugin.actionButtonDropdown.sidekickComponent.menuTitle',
    description: 'title of the sidekick component menu (internal part)',
  },
});

export const useGetInternationalization = (pluginApi: PluginApi) => {
  const {
    messages: localeMessages,
    currentLocale,
    loading: localeMessagesLoading,
  } = pluginApi.useLocaleMessages!(LOCALE_REQUEST_OBJECT);

  const cache = createIntlCache();
  const intl = (!localeMessagesLoading && localeMessages) ? createIntl({
    locale: currentLocale,
    messages: localeMessages,
    fallbackOnEmptyString: true,
  }, cache) : null;

  return {
    intl,
    localeMessagesLoading,
  };
};

export const useTypedCaptionsPanelManager = (
  pluginApi: PluginApi,
  intl: IntlShape | null,
  localeMessagesLoading: boolean,
  pluginUuid: string,
) => {
  const {
    data: activeCaptionMenusResponseFromDataChannel,
  } = pluginApi.useDataChannel!<ActiveCaptionMenuInformation>('typed-captions-data-channel', DataChannelTypes.ALL_ITEMS, 'caption-menus');

  const currentUserResponse = pluginApi.useCurrentUser!();

  useEffect(() => {
    if ((intl && !localeMessagesLoading)
      && activeCaptionMenusResponseFromDataChannel?.data
      && currentUserResponse?.data?.role === 'MODERATOR') {
      const sectionName = intl.formatMessage(intlMessages.sectionName);
      const currentUserId = currentUserResponse?.data?.userId || '';
      const sidekickMenuComponentList = activeCaptionMenusResponseFromDataChannel?.data
        .filter((menu) => menu.fromUserId === currentUserId)
        .map((menu) => new GenericContentSidekickArea({
          name: intl.formatMessage(intlMessages.menuTitle, {
            0: menu.payloadJson.captionLocale,
          }),
          buttonIcon: 'closed_caption',
          section: sectionName,
          open: false,
          contentFunction: renderComponent(
            pluginUuid,
            intl,
            menu.payloadJson.captionLocale,
          ),
        }));
      pluginApi.setGenericContentItems(sidekickMenuComponentList);
    }
  }, [
    currentUserResponse,
    activeCaptionMenusResponseFromDataChannel,
    localeMessagesLoading, intl]);
};
