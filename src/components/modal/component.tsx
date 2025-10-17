import { defineMessages, IntlShape } from 'react-intl';
import * as React from 'react';
import * as Styled from './styles';
import LocalesDropdown from './locales-dropdown/component';
import { AvailableLocaleObject } from '../../common/types';

interface TypedCaptionsModalComponentProps {
  isOpen: boolean;
  intl: IntlShape;
  onRequestClose: () => void;
  handleStart: React.MouseEventHandler<HTMLButtonElement>;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  availableLocales: AvailableLocaleObject[];
  captionLocale: string;
  errorMessage: string;
}

const TIMEOUT_RENDER_ERROR = 3000;

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

function TypedCaptionsModalComponent(props: TypedCaptionsModalComponentProps) {
  const {
    isOpen,
    onRequestClose,
    intl,
    handleChange,
    availableLocales,
    captionLocale,
    errorMessage,
    handleStart,
  } = props;


  if (!intl) return null;
  const selectorLabel = intl.formatMessage(intlMessages.selectorLabel);
  return isOpen && (
    <Styled.TypedCaptionsModal
      portalClassName="modal-low"
      parentSelector={() => document.querySelector('#modals-container') as HTMLElement}
      overlayClassName="modalOverlay"
      isOpen={isOpen}
      onRequestClose={onRequestClose}
    >
      <Styled.CloseButton
        type="button"
        className="clickable-close"
        onClick={() => {
          onRequestClose();
        }}
      >
        <i
          className="icon-bbb-close"
        />
      </Styled.CloseButton>
      <Styled.Content>
        <span>
          {selectorLabel}
        </span>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label
          htmlFor="captionsLangSelector"
        />
        <Styled.WriterMenuSelect>
          <LocalesDropdown
            allLocales={availableLocales}
            handleChange={handleChange}
            value={captionLocale}
            elementId="captionsLangSelector"
            intl={intl}
            selectMessage={intl.formatMessage(intlMessages.selectPlaceholder)}
          />
        </Styled.WriterMenuSelect>
        {errorMessage ?? (
          <Styled.ErrorLabel>
            {errorMessage}
          </Styled.ErrorLabel>
        )}
        <Styled.StartBtn
          type="button"
          onClick={(e) => { handleStart(e); }}
        >
          {intl.formatMessage(intlMessages.startButtonLabel)}
        </Styled.StartBtn>
      </Styled.Content>
    </Styled.TypedCaptionsModal>
  );
}

export { TypedCaptionsModalComponent };
