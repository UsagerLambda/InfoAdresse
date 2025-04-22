import React from 'react';
import Button from '../common/Button';
import { apiService } from '../../services/index'

const Header: React.FC = () => {

  const isAuthenticated = apiService.isAuthenticated();
  const first_name = localStorage.getItem('first_name')

  const button_header = `px-3 py-1 bg-white text-gray-800 border-1 border-gray-800 rounded-full hover:bg-gray-100 transition-colors duration-200 font-medium font-extralight`
  const button_header_black = `px-3 py-1 bg-gray-800 text-white border-1 rounded-full hover:bg-gray-600 transition-colors duration-200 font-medium font-extralight`
  const button_header_logged = `px-2 py-1 bg-gray-800 text-white border-1 border-gray-800 rounded-full hover:bg-gray-900 transition-colors duration-200 font-extralight`

  return (
    <header className='px-6 py-3 shadow-md flex justify-between items-center'>
      <div>
        <a href="/" className='font-bold text-xl'>InfoAdresse</a>
      </div>
      <div className='flex gap-3'>
      {!isAuthenticated ? (
        <>
          <a href="/auth#login"><Button className={button_header}>Connexion</Button></a>
          <a href="/auth#register"><Button className={button_header_black}>Inscription</Button></a>
        </>
      ) : (
        <a href="/profil"><Button className={button_header_logged}>Bonjour {first_name}</Button></a>
      )}
      </div>
    </header>
  );
};

export default Header;
