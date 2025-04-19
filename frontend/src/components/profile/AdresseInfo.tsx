import React, { useState, useEffect } from 'react';
import api, { User } from '../../services/api';

const AdresseInfo: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.getCurrentUser();
        setUserData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="mx-auto">
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800 mr-2"></div>
          <p className="text-sm text-gray-500">Chargement des données...</p>
        </div>
      ) : userData && userData.history ? (
        Array.isArray(userData.history) && userData.history.length > 0 ? (
          <div className="space-y-3 mt-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
              Adresses précédemment recherchées
            </h3>
            <ul className="space-y-3">
              {userData.history.map((item, index) => (
                <li 
                  key={index} 
                  className="p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500">Aucun historique disponible</p>
          </div>
        )
      ) : (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-gray-500">Aucune donnée utilisateur disponible</p>
        </div>
      )}
    </div>
  )
}

export default AdresseInfo;
