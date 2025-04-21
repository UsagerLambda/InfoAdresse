import React from 'react';
import Button from '../common/Button';
import { apiService } from '../../services/index'

const Header: React.FC = () => {

  const isAuthenticated = apiService.isAuthenticated();

  return (
    <header>
      <a href="/">InfoAdresse</a>
      {!isAuthenticated ? (
        <>
          <a href="/auth#login"><Button>Connexion</Button></a>
          <a href="/auth#register"><Button>Inscription</Button></a>
        </>
      ) : (
        <a href="/profil"><Button>Bonjour {localStorage.getItem('first_name')} {localStorage.getItem('last_name')}</Button></a>
      )}
    </header>
  );
};

export default Header;
