import React from 'react';
import Button from '../common/Button';
import UpdateForm from './InnerForm/UpdateForm';
import SettingsForm from './InnerForm/SettingsForm';
import HistoryForm from './InnerForm/HistoryForm';
import { authService } from '../../services';

interface ProfileTabs {
  	activeTab: 'profil' | 'adresse' | 'settings';
  	onTabChange: (tab: 'profil' | 'adresse' | 'settings') => void;
}

const ProfilForm: React.FC<ProfileTabs> = ({activeTab, onTabChange}) => {

	const handleLogout = () => { // Fonction qui gère la déconnexion
		authService.logout();
		localStorage.removeItem('first_name');
		localStorage.removeItem('last_name');
		localStorage.removeItem('email');
		localStorage.removeItem('id');
		window.location.href = '/';
  	};

  	const renderForm = () => {
    	switch (activeTab) {
      	case 'profil':
        	return <UpdateForm />;
      	case 'adresse':
        	return <HistoryForm />;
      	case 'settings':
        	return <SettingsForm />;
      	default:
        	return <UpdateForm />;
    	}
  	};

  	return (
    	<>
        	<Button onClick={() => onTabChange('profil')}>Modifier mon profil</Button>
        	<Button onClick={() => onTabChange('adresse')}>Mes adresses sauvegardées</Button>
        	<Button onClick={() => onTabChange('settings')}>Paramètres de confidentialité</Button>
        	<Button onClick={handleLogout}>Se déconnecter</Button>
        	{renderForm()}
    	</>
  	);
};

export default ProfilForm;
