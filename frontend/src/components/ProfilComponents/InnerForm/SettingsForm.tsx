import React, {useState} from 'react';
import Button from '../../common/Button';
import { authService } from '../../../services';
import { SetSuccess } from '../../common/Success';
import { SetError } from '../../common/Error';

const SettingsForm: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false); // Variable pour vérifier l'état actuel du processus de l'api
	const [error, setError] = useState<string | null>(null); // Variable qui stocke un message d'erreur
	const [success, setSuccess] = useState<string | null>(null); // Variable qui stocke un message de succès

	const handleDelete = async () => {
		setIsLoading(true);
		const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
		if (!confirmDelete) {
            return;
        }
		try {
			await authService.deleteAccount();
			setSuccess("Compte supprimé avec succès !")
			window.location.href = '/';
		} catch (err) {
			setError(String(err));
		} finally {
			localStorage.removeItem('first_name');
			localStorage.removeItem('last_name');
			localStorage.removeItem('email');
			localStorage.removeItem('id');
			setIsLoading(false);
		}
	}

	return (
		<>
			{error && <SetError message={error} />}
			{success && <SetSuccess message={success} />}
			<Button className="w-full px-3 py-1 text-left bg-red-500 text-lg rounded-md text-white hover:bg-red-400 text-center" onClick={handleDelete} disabled={isLoading}>{isLoading ? 'Suppression en cours...' : 'Suppression du compte'}</Button>
		</>
  	);
};

export default SettingsForm;
