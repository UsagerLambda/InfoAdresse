const Footer: React.FC = () => {
    const year = new Date().getFullYear();
    
    return (
      <footer className="py-6 px-4 mt-auto">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© {year} InfoAdresse - Toutes les données sont fournies à titre informatif</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
