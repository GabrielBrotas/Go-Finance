import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  position: absolute;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  height: 500px;
  width: 100%;
  top: 0;
  padding: 64px;

  background-color: #fff;
  box-shadow: 0 0 60em black;

  > div {
    flex: 1;
    width: 100%;
    position: relative;
  }

  h1 {
    font-weight: 500;
    font-size: 36px;
    line-height: 54px;
    color: #363f5f;
    text-align: center;
    margin-bottom: 50px;
  }

  select {
    width: 100%;
    height: 55px;
    border-radius: 5px;
    color: #363f5f;
    padding: 15px;
  }

  .input-wrapper {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 32px;
    margin-top: 30px;
  }

  button {
    width: 100%;
    margin-top: 80px;
    background: #ff872c;
    color: #fff;
    border-radius: 5px;
    padding: 15px 80px;
    border: 0;
    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#ff872c')};
    }
  }

  svg {
    position: absolute;
    top: 20px;
    right: 64px;
    cursor: pointer;
  }
`;
