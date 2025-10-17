import {
  ActionButtonDropdownOption,
  ActionButtonDropdownSeparator,
  DataChannelTypes,
  GenericContentSidekickArea,
  PluginApi,
} from 'bigbluebutton-html-plugin-sdk';
import { useEffect, useState } from 'react';
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
  writeCC: {
    id: 'plugin.actionButtonDropdown.write',
    description: 'action button dropdown label to start writing',
  },
  stopCC: {
    id: 'plugin.actionButtonDropdown.remove',
    description: 'action button dropdown label to start writing',
  },
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

export const useActionsButtonManager = (
  pluginApi: PluginApi,
  intl: IntlShape | null,
  localeMessagesLoading: boolean,
) => {
  const {
    data: activeCaptionMenusResponseFromDataChannel,
    deleteEntry: deleteActiveCaptionMenuResponseFromDataChannel,
  } = pluginApi.useDataChannel!<ActiveCaptionMenuInformation>(
    'typed-captions-data-channel',
    DataChannelTypes.ALL_ITEMS,
    'caption-menus',
  );

  const [captionLocale, setCaptionLocale] = useState('');

  const currentUserResponse = pluginApi.useCurrentUser!();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onRequestClose = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (currentUserResponse?.data?.role === 'MODERATOR') {
      let captionLocaleFromMenus = '';
      if (captionLocale === '') {
        activeCaptionMenusResponseFromDataChannel?.data?.forEach((item) => {
          if (item.fromUserId === currentUserResponse?.data?.userId) {
            setCaptionLocale(item.payloadJson.captionLocale);
            captionLocaleFromMenus = item.payloadJson.captionLocale;
          }
        });
      }
      const entryIdToRemove = activeCaptionMenusResponseFromDataChannel?.data?.filter(
        (item) => item.payloadJson.captionLocale === captionLocale
        || captionLocaleFromMenus === item.payloadJson.captionLocale,
      )[0]?.entryId || '';
      let actionButtonDropdownOnClick = () => {
        deleteActiveCaptionMenuResponseFromDataChannel([entryIdToRemove]);
      };
      let actionButtonDropdownLabel = '';
      if (intl) {
        if (!entryIdToRemove) {
          actionButtonDropdownLabel = intl.formatMessage(intlMessages.writeCC);
          actionButtonDropdownOnClick = () => {
            setIsModalOpen(true);
          };
        } else actionButtonDropdownLabel = intl.formatMessage(intlMessages.stopCC);
      }
      if (!localeMessagesLoading && intl) {
        pluginApi.setActionButtonDropdownItems([
          new ActionButtonDropdownSeparator(),
          new ActionButtonDropdownOption({
            icon: 'closed_caption',
            label: actionButtonDropdownLabel,
            tooltip: 'this is a button injected by plugin',
            allowed: true,
            onClick: actionButtonDropdownOnClick,
          }),
        ]);
      }
    } else {
      pluginApi.setActionButtonDropdownItems([]);
      pluginApi.setGenericContentItems([]);
    }
  }, [
    currentUserResponse,
    activeCaptionMenusResponseFromDataChannel,
    localeMessagesLoading, intl]);

  return {
    isModalOpen,
    onRequestClose,
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

  /// contentFunction, name, section, buttonIcon
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
          open: true,
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
