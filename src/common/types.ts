export interface CaptionMessage {
  text: string;
  locale: string;
}

export interface CaptionMenu {
  captionLocale: string;
}

export interface sidekickMenuLocale {
  locale: string;
}

type Locale = 'de-DE'
  | 'en-US'
  | 'es-ES'
  | 'fr-FR'
  | 'hi-ID'
  | 'it-IT'
  | 'ja-JP'
  | 'pt-BR'
  | 'ru-RU'
  | 'zh-CN';

export interface AvailableLocaleObject {
  locale: Locale;
  name: string;
}

export interface WindowWithSettings extends Window {
  meetingClientSettings: {
    public: {
      app: {
        showAllAvailableLocales: boolean;
        audioCaptions: {
          language: {
            available: string[];
          }
        }
      };
    };
  };
}
