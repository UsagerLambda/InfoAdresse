import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="text-center my-8">
      <h1 className="text-4xl font-bold mb-4">Toutes les informations sur une adresse</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Cadastre, PLU, risques naturels, démographie et plus encore en quelques secondes.
      </p>
    </section>
  );
};

export default HeroSection;
