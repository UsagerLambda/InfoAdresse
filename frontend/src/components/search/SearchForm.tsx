import React, { useState } from 'react';
import Button from '../common/Button';
import api from '../../services/api';

const SearchForm: React.FC = () => {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) return; // Si pas d'adresse, ne rien faire
    setIsLoading(true); // affiche le bouton comme "Recherche en cours..."

    try {
      // call la méthode searchAddress du fichier api.tsx
      const result = await api.searchAddress(address);
      console.log('Résultat de la recherche:', result);
    } catch (error) {
      console.error('Erreur lors de la recherche d\'adresse:', error);
    } finally {
      setIsLoading(false); // remet le bouton à son état normal
    }
  };

  return (
    <section className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Recherchez une adresse</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="address" className="block text-gray-700">Saisissez une adresse complète</label>
        <div className="relative">
          <input
            type="text"
            id="address"
            placeholder="Ex: 20 avenue de Ségur, 75007 Paris"
            className="w-full p-2 border border-gray-300 rounded-lg pr-10"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            ↓
          </span>
        </div>
        <Button variant="solid" size="md" fullWidth type="submit" disabled={isLoading}>{isLoading ? 'Recherche en cours...' : 'Rechercher'}</Button>
      </form>
    </section>
  );
};

export default SearchForm;
