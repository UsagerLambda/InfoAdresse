import React, { useState } from 'react';
import api, { LoginRequest } from '../../services/api';

const LoginForm: React.FC = () => {

    const [credentials, setCredentials] = useState<LoginRequest>({
        username: '', // email de l'utilisateur
        password: ''
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

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          const response = await api.login(credentials);
          console.log(response)
          setSuccess('Vous vous êtes connecté avec succès !')
          window.location.href = '/';
        } catch (err) {
          setError('Échec de la connexion. Veuillez vérifier vos identifiants.');
          console.error(err);
        }
      };


      return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
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
          
          <div className="mb-6">
            <label htmlFor="username" className="block mb-2 font-bold text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-colors focus:border-gray-800 focus:outline-none"
            />
          </div>
    
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-bold text-gray-600">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Votre mot de passe"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-colors focus:border-gray-800 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gray-800 text-white rounded-md text-base cursor-pointer transition-colors hover:bg-gray-900"
          >
            Se connecter
          </button>

          <div className="mt-6 text-center text-gray-600">
      </div>
    </form>
      );
    };

export default LoginForm;
