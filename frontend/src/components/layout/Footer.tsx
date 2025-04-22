import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='text-sm font-normal text-gray-800 text-center'>
      <p>© {year} InfoAdresse - Toutes les données sont fournies à titre informatif</p>
    </footer>
  );
};

export default Footer;
