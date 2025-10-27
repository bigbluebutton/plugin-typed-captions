import * as React from 'react';
import {
  BbbPluginSdk,
  PluginApi,
} from 'bigbluebutton-html-plugin-sdk';

import { TypedCaptionsProps } from './types';
import { TypedCaptionsModalContainer } from '../components/modal/container';
import { useGetInternationalization, useTypedCaptionsPanelManager } from './hooks';

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
  );

  return (intl
    ? (
      <TypedCaptionsModalContainer
        intl={intl}
        localeMessagesLoading={localeMessagesLoading}
        pluginApi={pluginApi}
      />
    ) : null
  );
}

export default TypedCaptions;
