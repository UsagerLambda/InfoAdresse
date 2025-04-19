import ProfileInfo from './ProfileInfo';
import AdresseInfo from './AdresseInfo';
import Settings from './Settings';
import api, { User } from '../../services/api';
import React, { useState, useEffect } from 'react';
import Button from '../common/Button';

interface ProfileTabs {
    activeTab: 'profil' | 'address' | 'settings';
    onTabChange: (tab: 'profil' | 'address' | 'settings') => void;
  }

  const ProfileForm: React.FC<ProfileTabs> = ({ activeTab, onTabChange }) => {
    const [userInfo, setUserInfo] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const userData = await api.getCurrentUser();
            setUserInfo(userData);
          } catch (error) {
            console.error("Erreur lors de la récupération des données utilisateur:", error);
          }
        };
        fetchUserData();
      }, []);

    const renderForm = () => {
        switch (activeTab) {
          case 'profil':
            return <ProfileInfo />;
          case 'address':
            return <AdresseInfo />;
          case 'settings':
            return <Settings />;
          default:
            return <ProfileInfo />;
        }
      };

      if (!userInfo) {
        return <div className="flex justify-center items-center h-screen">Chargement...</div>;
      }

      return (
        <div className="profile-container flex flex-col md:flex-row max-w-6xl mx-auto p-4 gap-8">
            <div className="profile-sidebar bg-white rounded-lg shadow-md p-6 w-full md:w-1/4">
                <div className="flex justify-center mb-4">
                <div className="profile-avatar bg-gray-800 text-white w-24 h-24 rounded-full flex items-center justify-center text-5xl font-bold">
                    {userInfo.first_name.charAt(0)}
                </div>
            </div>
            <h1 className="profile-name text-xl font-bold mb-1 text-center">{userInfo.first_name} {userInfo.last_name}</h1>
            <p className="profile-email text-gray-600 mb-6 text-center">{userInfo.email}</p>
        
            <div className="flex flex-col space-y-2">
              <Button
                variant={activeTab === 'profil' ? 'selected' : 'outline'}
                fullWidth={true}
                type="button"
                onClick={() => onTabChange('profil')}
                className="text-left pl-4 py-3 transition-colors rounded-lg">
                Modifier mon profil</Button>

              <Button
                variant={activeTab === 'address' ? 'selected' : 'outline'}
                fullWidth={true}
                type="button"
                onClick={() => onTabChange('address')}
                className="text-left pl-4 py-3 transition-colors rounded-lg">
                Mes adresses sauvegardées</Button>

              <Button
                variant={activeTab === 'settings' ? 'selected' : 'outline'}
                fullWidth={true}
                type="button"
                onClick={() => onTabChange('settings')}
                className="text-left pl-4 py-3 transition-colors rounded-lg">
                Paramètres de confidentialité</Button>

              <Button variant="outline" fullWidth={true} type="button" onClick={() => {api.logout(); window.location.href = '/';}} className="text-left pl-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Se déconnecter</Button>
            </div>
          </div>

          <div className="profile-main bg-white rounded-lg shadow-md p-6 w-full md:w-3/4">
            {renderForm()}
          </div>
        </div>
      );
    };

  export default ProfileForm;
