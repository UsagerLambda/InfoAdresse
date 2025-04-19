import React, { useState } from 'react';
import api, { RegisterRequest } from '../../services/api';

const RegisterForm: React.FC = () => {

    const [credentials, setCredentials] = useState<RegisterRequest>({
        first_name: '',
        last_name: '',
        email: '',
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
          const response = await api.register(credentials);
          console.log('Inscription réussie:', response);
          setSuccess('Enregistrement effectué avec succès !')
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

            <div className="flex gap-4 mb-6">
                <div className="flex-1">
                    <label htmlFor="first_name" className="block mb-2 font-bold text-gray-600">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-colors focus:border-gray-800 focus:outline-none"
                    />
                </div>

                <div className="flex-1">
                    <label htmlFor="last_name" className="block mb-2 font-bold text-gray-600">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-colors focus:border-gray-800 focus:outline-none"
                    />
                </div>
            </div>

            <div className="mb-6">
                <label htmlFor="email" className="block mb-2 font-bold text-gray-600">
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
                    placeholder="Choisissez un mot de passe sécurisé"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-colors focus:border-gray-800 focus:outline-none"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="password_confirm" className="block mb-2 font-bold text-gray-600">
                    Confirmer le mot de passe
                </label>
                <input
                    type="password"
                    id="password_confirm"
                    name="password_confirm"
                    required
                    placeholder="Confirmer votre mot de passe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-colors focus:border-gray-800 focus:outline-none"
                />
            </div>

            <button
                type="submit"
                className="w-full py-3 bg-gray-800 text-white rounded-md text-base cursor-pointer transition-colors hover:bg-gray-900"
            >
                S'inscrire
            </button>

            <div className="mt-6 text-center text-gray-600">
            </div>
        </form>
    );
};

export default RegisterForm;
