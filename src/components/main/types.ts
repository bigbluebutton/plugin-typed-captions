import { IntlShape } from 'react-intl';
import { PluginApi } from 'bigbluebutton-html-plugin-sdk';

interface TypedCaptionsProps {
    intl: IntlShape;
    pluginApi: PluginApi;
    uuid: string;
}

interface ExternalVideoMeetingSubscription {
    meeting: {
        externalVideo: {
            playerPlaying: boolean
            externalVideoUrl: string
        }
    }[]
}

export { TypedCaptionsProps, ExternalVideoMeetingSubscription };
