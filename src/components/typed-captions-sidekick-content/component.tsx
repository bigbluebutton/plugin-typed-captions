import { BbbPluginSdk, DataChannelTypes, PluginApi } from 'bigbluebutton-html-plugin-sdk';
import { IntlShape } from 'react-intl';
import * as React from 'react';

import Styled from './styles';
import { TypedCaptionsInput } from './input-captions/component';
import { CaptionMessage } from '../../common/types';
import { CaptionMessagesList } from './caption-messages-list/component';
import { intlMessages } from '../../intlMessages';

interface GenericContentExampleProps {
  uuid: string;
  intl: IntlShape;
  captionLocale: string;
}

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
  } = pluginApi.useDataChannel<CaptionMessage>('typed-captions-data-channel', DataChannelTypes.ALL_ITEMS, `caption-messages-${captionLocale}`);

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
