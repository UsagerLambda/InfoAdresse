import React, { useState } from 'react';
import api, { UpdateRequest } from '../../services/api';
import Button from '../common/Button';

const ProfileInfo: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [credentials, setCredentials] = useState<UpdateRequest & {password_confirm?: string}>({ // Interface UpdateRequest + le champ password_confirm
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      old_password: '',
      password_confirm: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
          ...prev,
          [name]: value
        }));
      };

      const validateForm = () => {
        if (credentials.password && credentials.password !== credentials.password_confirm) {
          setError('Les mots de passe ne correspondent pas.');
          return false;
        }

        if (credentials.password && !credentials.old_password) {
          setError('Veuillez saisir votre mot de passe actuel pour le modifier.');
          return false;
        }

        return true;
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return; // vérifie la validité des informations

        setLoading(true); // active l'état de chargement (pour le bouton submit)
        setError(null); // clear le setError
        setSuccess(null); // clear le setSuccess

        const dataToSend = {...credentials}; // récupère les credentials du formulaire
        delete dataToSend.password_confirm; // supprime du formulaire la confirmation du mot de passe (déja vérifié par validateForm)

        try {
          const response = await api.updateUserProfile(dataToSend); // appel api (updateUserProfile)
          console.log('Mise à jour réussie:', response);
          setSuccess('Vos informations ont été mises à jour avec succès.'); // message de succès sur la page
          setLoading(false); // désactivation du de l'état de chargement (pour le bouton submit)
        } catch (err) {
          setError('Échec de la mise à jour. Veuillez vérifier vos informations.'); // Si erreur, message à l'utilisateur
          console.error(err);
          setLoading(false); // désactivation du de l'état de chargement (pour le bouton submit)
        }
      };

  return (
    <form onSubmit={handleSubmit}>
        {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div> // Encart de gestion des erreurs (affiche l'erreur dans un encart rouge)
      )}

      {success && (
        <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div> // Encart de gestion des succès (affiche le succès dans un encart vert)
      )}

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
            Prénom
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={credentials.first_name}
            onChange={handleChange}
            required
            placeholder="Votre prénom"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={credentials.last_name}
            onChange={handleChange}
            required
            placeholder="Votre nom"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          required
          placeholder="votre@email.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="old_password" className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe actuel
        </label>
        <input
          type="password"
          id="old_password"
          name="old_password"
          value={credentials.old_password}
          onChange={handleChange}
          placeholder="Votre mot de passe actuel"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <p className="text-sm text-gray-500 mt-1">Nécessaire uniquement si vous souhaitez changer votre mot de passe</p>
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Nouveau mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Choisissez un nouveau mot de passe sécurisé"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmer le nouveau mot de passe
        </label>
        <input
          type="password"
          id="password_confirm"
          name="password_confirm"
          value={credentials.password_confirm}
          onChange={handleChange}
          placeholder="Confirmer votre nouveau mot de passe"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <Button
        variant='solid'
        fullWidth={true}
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gray-800 text-white rounded-md text-base cursor-pointer transition-colors hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed">
        {loading ? 'Mise à jour en cours...' : 'Mettre à jour les informations du compte'}
      </Button>
    </form>
  );
}
export default ProfileInfo;
