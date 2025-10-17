import { DataChannelEntryResponseType } from 'bigbluebutton-html-plugin-sdk/dist/cjs/data-channel/types';
import * as React from 'react';
import { CaptionMessage } from '../../../common/types';
import Styled from './styles';
import { IntlShape } from 'react-intl';

interface CaptionMessagesListProps {
  captionMessagesResponse: DataChannelEntryResponseType<CaptionMessage>[];
  intl: IntlShape;
}

export function CaptionMessagesList(props: CaptionMessagesListProps) {
  const {
    captionMessagesResponse,
    intl,
  } = props;

  return (
    <Styled.CaptionMessagesListWrapper>
      {captionMessagesResponse?.slice(0).reverse().map((item) => {
        const { createdAt, payloadJson } = item;
        const dateCreatedAt = new Date(createdAt);
        const time = intl.formatTime(dateCreatedAt);
        const { text } = payloadJson;
        return (
          <Styled.CaptionMessageWrapper
            key={item.entryId}
          >
            <Styled.CaptionMessageItem>{text}</Styled.CaptionMessageItem>
            <Styled.CaptionMessageItem>{time}</Styled.CaptionMessageItem>
          </Styled.CaptionMessageWrapper>
        );
      })}
    </Styled.CaptionMessagesListWrapper>
  );
}
