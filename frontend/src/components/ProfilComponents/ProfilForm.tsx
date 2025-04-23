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

	const firstName = localStorage.getItem("first_name");
	const lastName = localStorage.getItem("last_name");
	const email = localStorage.getItem("email");
	const firstLetter: string = firstName?.[0] ?? "";

  	return (
    	<>
			<div className='w-full md:w-11/12 lg:w-4/5 xl:w-5/8 mx-auto flex flex-col md:flex-row rounded-lg shadow-md overflow-hidden my-4 md:my-8'>
				<div className='w-full md:w-1/4 bg-gray-100 p-4 flex flex-col gap-2 bg-white'>
					<div className='flex flex-col items-center mb-4'>
						<div className="my-2 text-center text-5xl bg-gray-800 text-white font-bold rounded-full w-20 h-20 flex items-center justify-center">
							{firstLetter}
						</div>
						<h2 className="text-lg font-semibold">{firstName} {lastName}</h2>
          				<h3 className="text-sm text-gray-600">{email}</h3>
					</div>
        			<Button className={`w-full px-3 py-1 text-left text-lg rounded-md ${activeTab === 'profil' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`} onClick={() => onTabChange('profil')}>Modifier mon profil</Button>
        			<Button className={`w-full px-3 py-1 text-left text-lg rounded-md ${activeTab === 'adresse' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`} onClick={() => onTabChange('adresse')}>Mes adresses sauvegardées</Button>
        			<Button className={`w-full px-3 py-1 text-left text-lg rounded-md ${activeTab === 'settings' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`} onClick={() => onTabChange('settings')}>Paramètres de confidentialité</Button>
        			<Button className="w-full px-3 py-1 text-left bg-red-500 text-lg rounded-md text-white hover:bg-red-300" onClick={handleLogout}>Se déconnecter</Button>
				</div>
				<div className='w-full md:w-3/4 p-4 bg-white'>
          			{renderForm()}
        		</div>
			</div>
    	</>
  	);
};

export default ProfilForm;
