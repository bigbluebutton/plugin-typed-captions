import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BbbPluginSdk, PluginApi } from 'bigbluebutton-html-plugin-sdk';
import TypedCaptions from './components/main/component';
import { useInjectIntl } from './hooks/injectIntl';

const uuid = document.currentScript?.getAttribute('uuid') || 'root';

function PluginInitializer({ pluginUuid }:
  { pluginUuid: string }): React.ReactNode {
  BbbPluginSdk.initialize(pluginUuid);
  const pluginApi: PluginApi = BbbPluginSdk.getPluginApi(pluginUuid);
  const IntlInjectedTypedCaptions = useInjectIntl(TypedCaptions, pluginApi);
  return (<IntlInjectedTypedCaptions uuid={uuid} />);
}

const root = ReactDOM.createRoot(document.getElementById(uuid));
root.render(
  <React.StrictMode>
    <PluginInitializer {...{
      pluginUuid: uuid,
    }}
    />
  </React.StrictMode>,
);
