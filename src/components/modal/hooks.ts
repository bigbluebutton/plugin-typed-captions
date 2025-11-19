import {
  ActionButtonDropdownOption,
  ActionButtonDropdownSeparator,
  DataChannelTypes,
  PluginApi,
} from 'bigbluebutton-html-plugin-sdk';
import { useEffect, useState } from 'react';
import {
  defineMessages,
  IntlShape,
} from 'react-intl';
import { ActiveCaptionMenuInformation } from '../../common/types';

const intlMessages = defineMessages({
  writeCC: {
    id: 'plugin.actionButtonDropdown.write',
    description: 'action button dropdown label to start writing',
  },
  stopCC: {
    id: 'plugin.actionButtonDropdown.remove',
    description: 'action button dropdown label to start writing',
  },
});

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

  const currentUserId = currentUserResponse?.data?.userId || '';

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onRequestClose = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (currentUserResponse?.data?.role === 'MODERATOR') {
      if (captionLocale === '') {
        activeCaptionMenusResponseFromDataChannel?.data?.forEach((item) => {
          if (item.payloadJson.userId === currentUserId) {
            setCaptionLocale(item.payloadJson.captionLocale);
          }
        });
      }
      const entryIdToRemove = activeCaptionMenusResponseFromDataChannel?.data?.filter(
        (item) => item.payloadJson.userId === currentUserId,
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
