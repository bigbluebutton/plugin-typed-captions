import { ActiveCaptionMenuInformation } from '../common/types';

interface TypedCaptionsProps {
    pluginName: string,
    pluginUuid: string,
}

interface ExternalVideoMeetingSubscription {
    meeting: {
        externalVideo: {
            playerPlaying: boolean
            externalVideoUrl: string
        }
    }[]
}

export type PushActiveCaptionFunction = (args: ActiveCaptionMenuInformation) => void;

export { TypedCaptionsProps, ExternalVideoMeetingSubscription };
