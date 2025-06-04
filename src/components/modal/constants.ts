import { WindowWithSettings } from '../../common/types';

declare const window: WindowWithSettings;

const CONFIG = window.meetingClientSettings.public.app.audioCaptions;
export const CAPTIONS_CONFIG_LANGUAGES = CONFIG.language.available;

export const AVAILABLE_LOCALES = [
  { locale: 'de-DE', name: 'German' },
  { locale: 'en-US', name: 'English' },
  { locale: 'es-ES', name: 'Spanish' },
  { locale: 'fr-FR', name: 'French' },
  { locale: 'hi-ID', name: 'Hindi' },
  { locale: 'it-IT', name: 'Italian' },
  { locale: 'ja-JP', name: 'Japanese' },
  { locale: 'pt-BR', name: 'Portuguese' },
  { locale: 'ru-RU', name: 'Russian' },
  { locale: 'zh-CN', name: 'Chinese' },
];
