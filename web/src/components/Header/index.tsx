import React, { useEffect, useState } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { Container } from './styles';

import Logo from '../../assets/logo.svg';

interface HeaderProps {
  size?: 'small' | 'large';
}

const Header: React.FC<HeaderProps> = ({ size = 'large' }: HeaderProps) => {
  const { pathname } = useLocation();

  const [isHomePage, setIsHomePage] = useState(true);

  useEffect(() => {
    if (pathname !== '/') {
      setIsHomePage(false);
    } else {
      setIsHomePage(true);
    }
  }, [pathname]);

  return (
    <Container size={size} isHomePage={isHomePage}>
      <header>
        <img src={Logo} alt="GoFinances" />
        <nav>
          <Link to="/">Listagem</Link>
          <Link to="/import">Importar</Link>
        </nav>
      </header>
    </Container>
  );
};

export default Header;
