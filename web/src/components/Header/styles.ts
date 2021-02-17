import styled, { css } from 'styled-components';

interface ContainerProps {
  size?: 'small' | 'large';
  isHomePage: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #5636d3;
  padding: 30px 0;

  header {
    width: 1120px;
    margin: 0 auto;
    padding: ${({ size }) => (size === 'small' ? '0 20px ' : '0 20px 150px')};
    display: flex;
    align-items: center;
    justify-content: space-between;

    nav {
      a {
        color: #fff;
        text-decoration: none;
        font-size: 16px;
        transition: opacity 0.2s;

        ${({ isHomePage }) =>
          isHomePage
            ? css`
                border-bottom-width: 3px;
                border-bottom-color: #ff872c;
                border-bottom-style: solid;
                padding-bottom: 8px;
              `
            : css`
                border: none;
              `}

        & + a {
          margin-left: 32px;

          ${({ isHomePage }) =>
            !isHomePage
              ? css`
                  border-bottom-width: 3px;
                  border-bottom-color: #ff872c;
                  border-bottom-style: solid;
                  padding-bottom: 8px;
                `
              : css`
                  border: none;
                `}
        }

        &:hover {
          opacity: 0.6;
        }
      }
    }
  }
`;
