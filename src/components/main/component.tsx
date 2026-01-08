import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import {
  MediaAreaOption,
  MediaAreaSeparator,
  DataChannelTypes,
  GenericContentSidekickArea,
} from 'bigbluebutton-html-plugin-sdk';

import { TypedCaptionsModal } from '../modal/component';
import { CaptionMenu } from '../../common/types';
import { TypedCaptionsSidekickArea } from '../typed-captions-sidekick-content/component';
import { TypedCaptionsProps } from './types';
import { intlMessages } from '../../intlMessages';

function TypedCaptions({ intl, pluginApi, uuid }: TypedCaptionsProps): React.ReactElement {
  const {
    data: captionMenusResponseFromDataChannel,
    pushEntry: pushCaptionMenuResponseFromDataChannel,
    deleteEntry: excludeCaptionMenuResponseFromDataChannel,
  } = pluginApi.useDataChannel<CaptionMenu>('typed-captions-data-channel', DataChannelTypes.ALL_ITEMS, 'caption-menus');

  const [captionLocale, setCaptionLocale] = React.useState('');

  const currentUserResponse = pluginApi.useCurrentUser();

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const onRequestClose = () => {
    setIsModalOpen(false);
  };

  /// contentFunction, name, section, buttonIcon
  React.useEffect(() => {
    if (captionMenusResponseFromDataChannel?.data && currentUserResponse?.data?.role === 'MODERATOR') {
      const sectionName = intl.formatMessage(intlMessages.sectionName);
      const sidekickMenuComponentList = captionMenusResponseFromDataChannel?.data
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
  }, [captionMenusResponseFromDataChannel]);

  React.useEffect(() => {
    if (currentUserResponse?.data?.role === 'MODERATOR') {
      let captionLocaleFromMenus = '';
      if (captionLocale === '') {
        captionMenusResponseFromDataChannel?.data?.forEach((item) => {
          if (item.fromUserId === currentUserResponse?.data?.userId) {
            setCaptionLocale(item.payloadJson.captionLocale);
            captionLocaleFromMenus = item.payloadJson.captionLocale;
          }
        });
      }
      const entryIdToRemove = captionMenusResponseFromDataChannel?.data?.filter(
        (item) => item.payloadJson.captionLocale === captionLocale
        || captionLocaleFromMenus === item.payloadJson.captionLocale,
      )[0]?.entryId;
      let actionButtonDropdownOnClick = () => {
        excludeCaptionMenuResponseFromDataChannel([entryIdToRemove]);
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
      pluginApi.setMediaAreaItems([
        new MediaAreaSeparator({}),
        new MediaAreaOption({
          icon: 'closed_caption',
          label: actionButtonDropdownLabel,
          tooltip: 'this is a button injected by plugin',
          allowed: true,
          onClick: actionButtonDropdownOnClick,
        }),
      ]);
    } else {
      pluginApi.setMediaAreaItems([]);
      pluginApi.setGenericContentItems([]);
    }
  }, [currentUserResponse, captionMenusResponseFromDataChannel]);

  return (
    <TypedCaptionsModal
      availableCaptionMenus={captionMenusResponseFromDataChannel?.data}
      pushCaptionMenu={pushCaptionMenuResponseFromDataChannel}
      captionLocale={captionLocale}
      intl={intl}
      setCaptionLocale={setCaptionLocale}
      isOpen={isModalOpen}
      onRequestClose={onRequestClose}
      pluginApi={pluginApi}
      setIsOpen={setIsModalOpen}
    />
  );
}

export default TypedCaptions;
