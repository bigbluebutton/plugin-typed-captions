import { BbbPluginSdk, DataChannelTypes, PluginApi } from 'bigbluebutton-html-plugin-sdk';
import { defineMessages, IntlShape } from 'react-intl';
import * as React from 'react';

import Styled from './styles';
import { TypedCaptionsInput } from './input-captions/component';
import { CaptionMessage } from '../../common/types';
import { CaptionMessagesList } from './caption-messages-list/component';

interface GenericContentExampleProps {
  uuid: string;
  intl: IntlShape;
  captionLocale: string;
}

const intlMessages = defineMessages({
  inputPlaceholder: {
    id: 'plugin.actionButtonDropdown.sidekickComponent.inputPlaceholder',
    description: 'Placeholder of the sidekick component input',
  },
});

export function TypedCaptionsSidekickArea(props: GenericContentExampleProps) {
  const {
    uuid,
    captionLocale,
    intl,
  } = props;
  const pluginApi: PluginApi = BbbPluginSdk.getPluginApi(uuid);
  const {
    data: captionMessagesResponseFromDataChannel,
    pushEntry: pushCaptionMessagesResponseFromDataChannel,
  } = pluginApi.useDataChannel<CaptionMessage>('typed-captions-data-channel', DataChannelTypes.All_ITEMS, `caption-messages-${captionLocale}`);

  const inputPlaceholder = intl.formatMessage(intlMessages.inputPlaceholder);
  return (
    <Styled.CaptionsWrapper>
      <CaptionMessagesList
        captionMessagesResponse={captionMessagesResponseFromDataChannel?.data}
      />
      <TypedCaptionsInput
        pluginApi={pluginApi}
        captionLocale={captionLocale}
        placeholder={inputPlaceholder}
        pushCaptionMessages={pushCaptionMessagesResponseFromDataChannel}
      />
    </Styled.CaptionsWrapper>
  );
}
