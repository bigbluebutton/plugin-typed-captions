/* eslint-disable @typescript-eslint/ban-ts-comment */
import styled from 'styled-components';
import { mdPaddingX, mdPaddingY, smallOnly } from '../modal/styles';

const CaptionsWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
  padding: ${mdPaddingX};

  @media ${smallOnly} {
    transform: none !important;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  margin-bottom: ${mdPaddingY};
`;

const SidekickMenuMinimizer = styled.button`
  background: none;
  border: none;

  color: #050505;
  &:hover {
    cursor: pointer;
  }
`;

export default {
  CaptionsWrapper,
  HeaderWrapper,
  SidekickMenuMinimizer,
};
