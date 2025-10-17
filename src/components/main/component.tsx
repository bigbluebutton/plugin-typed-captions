import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createIntl, defineMessages } from 'react-intl';

import {
  ActionButtonDropdownOption,
  ActionButtonDropdownSeparator,
  BbbPluginSdk,
  DataChannelTypes,
  GenericContentSidekickArea,
  PluginApi,
} from 'bigbluebutton-html-plugin-sdk';

import { TypedCaptionsProps } from './types';
import { TypedCaptionsModal } from '../modal/component';
import { ActiveCaptionMenuInformation } from '../../common/types';
import { TypedCaptionsSidekickArea } from '../typed-captions-sidekick-content/component';

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

function TypedCaptions(
  { pluginUuid: uuid }: TypedCaptionsProps,
): React.ReactElement {
  BbbPluginSdk.initialize(uuid);

  const pluginApi: PluginApi = BbbPluginSdk.getPluginApi(uuid);

  const {
    data: activeCaptionMenusResponseFromDataChannel,
    pushEntry: pushActiveCaptionMenuResponseFromDataChannel,
    deleteEntry: deleteActiveCaptionMenuResponseFromDataChannel,
  } = pluginApi.useDataChannel<ActiveCaptionMenuInformation>('typed-captions-data-channel', DataChannelTypes.ALL_ITEMS, 'caption-menus');

  const {
    messages,
    currentLocale,
    loading: localeMessagesLoading,
  } = pluginApi.useLocaleMessages({
    headers: {
      'ngrok-skip-browser-warning': 'any',
    },
  });

  const intl = (!localeMessagesLoading && messages) ? createIntl({
    locale: currentLocale,
    messages,
    fallbackOnEmptyString: true,
  }) : null;

  const [captionLocale, setCaptionLocale] = React.useState('');

  const currentUserResponse = pluginApi.useCurrentUser();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const onRequestClose = () => {
    setIsModalOpen(false);
  };

  /// contentFunction, name, section, buttonIcon
  React.useEffect(() => {
    if (!localeMessagesLoading && activeCaptionMenusResponseFromDataChannel?.data && currentUserResponse?.data?.role === 'MODERATOR') {
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
          contentFunction: (element: HTMLElement) => {
            const root = ReactDOM.createRoot(element);
            root.render(
              <React.StrictMode>
                <TypedCaptionsSidekickArea
                  captionLocale={menu.payloadJson.captionLocale}
                  uuid={uuid}
                  intl={intl}
                />
              </React.StrictMode>,
            );
            return root;
          },
        }));
      pluginApi.setGenericContentItems(sidekickMenuComponentList);
    }
  }, [
    currentUserResponse,
    activeCaptionMenusResponseFromDataChannel,
    localeMessagesLoading, messages]);

  React.useEffect(() => {
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
      )[0]?.entryId;
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
      if (!localeMessagesLoading) {
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
    localeMessagesLoading, messages]);

  return (
    <TypedCaptionsModal
      availableCaptionMenus={activeCaptionMenusResponseFromDataChannel?.data}
      pushCaptionMenu={pushActiveCaptionMenuResponseFromDataChannel}
      captionLocale={captionLocale}
      intl={intl}
      setCaptionLocale={setCaptionLocale}
      isOpen={isModalOpen}
      onRequestClose={onRequestClose}
      pluginApi={pluginApi}
      setIsOpen={setIsModalOpen}
      userId={currentUserResponse?.data?.userId || ''}
    />
  );
}

export default TypedCaptions;
