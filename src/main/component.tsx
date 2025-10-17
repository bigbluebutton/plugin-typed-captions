import * as React from 'react';
import { defineMessages } from 'react-intl';
import {
  BbbPluginSdk,
  PluginApi,
} from 'bigbluebutton-html-plugin-sdk';

import { TypedCaptionsProps } from './types';
import { TypedCaptionsModalContainer } from '../components/modal/container';
import { useActionsButtonManager, useGetInternationalization, useTypedCaptionsPanelManager } from './hooks';


const intlMessages = defineMessages({
  selectorLabel: {
    id: 'plugin.actionButtonDropdown.modal.selectorLabel',
    description: 'action button dropdown label to start writing',
  },
  selectPlaceholder: {
    id: 'plugin.actionButtonDropdown.modal.selectPlaceHolder',
    description: 'placeholder of the selector',
  },
  startButtonLabel: {
    id: 'plugin.actionButtonDropdown.modal.start',
    description: 'start button label',
  },
});


function TypedCaptions(
  { pluginUuid: uuid }: TypedCaptionsProps,
): React.ReactElement {
  BbbPluginSdk.initialize(uuid);

  const pluginApi: PluginApi = BbbPluginSdk.getPluginApi(uuid);

  const {
    intl,
    localeMessagesLoading,
  } = useGetInternationalization(pluginApi);

  useTypedCaptionsPanelManager(
    pluginApi,
    intl,
    localeMessagesLoading,
    uuid,
  )

  const {
    isModalOpen,
    onRequestClose,
  } = useActionsButtonManager(
    pluginApi,
    intl,
    localeMessagesLoading,
  );

  return (intl ?
    <TypedCaptionsModalContainer
      intl={intl}
      isOpen={isModalOpen}
      onRequestClose={onRequestClose}
      pluginApi={pluginApi}
    /> : <></>
  );
}

export default TypedCaptions;
