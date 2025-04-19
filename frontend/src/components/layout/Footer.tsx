import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer>
      <p>© {year} InfoAdresse - Toutes les données sont fournies à titre informatif</p>
    </footer>
  );
};

export default Footer;
