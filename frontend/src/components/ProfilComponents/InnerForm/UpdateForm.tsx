import React, {useState} from 'react';
import TextField from '../../common/TextField';
import Button from '../../common/Button';
import { UpdateRequest, authService } from '../../../services';
import { SetSuccess } from '../../common/Success';
import { SetError } from '../../common/Error';

const UpdateForm: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false); // Variable pour vérifier l'état actuel du processus de l'api
  	const [error, setError] = useState<string | null>(null); // Variable qui stocke un message d'erreur
  	const [success, setSuccess] = useState<string | null>(null); // Variable qui stocke un message de succès
  	const [update, setUpdate] = useState<UpdateRequest>({
		first_name: '',
  		last_name: '',
  		email: '',
 		password: '',
		old_password: ''
	});
	const [checkPassword, setCheckPassword] = useState<string>('');

	const handleCheckPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCheckPassword(e.target.value);
	  };

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUpdate(prev => ({
			...prev,
			[name]: value
		}));
	};

  	const handleSubmit = async () => {
		// Reset les variables setError & SetSuccess //
		setError(null);
		setSuccess(null);
		// ========================================= //

		// Vérifie que, si l'un des champ de mot de passe à été saisis, alors ceux-ci doivent tous l'être  //
		if (update.password || checkPassword || update.old_password) {
			if (!update.password || !checkPassword || !update.old_password) {
				setError("Veuillez saisir toutes vos informations");
				return;
			}
		}
		// ========================================= //
		// Vérifie que si les champ de mot de passes ont été saisis, alors ont vérifie que le nouveau mot de passe correspond avec celui de la vérification
		if (update.password && checkPassword && update.old_password) {
			if (update.password != checkPassword) {
				setError("Les mots de passe ne correspondent pas");
				return;
			}
		}
		setCheckPassword(''); // Supprime le mot de passe dans la variable

		try {
			setIsLoading(true);

			const credentials = {...update};

			const response = await authService.updateUserProfile(credentials);

			setSuccess('Compte mis à jour avec succès !')
			console.log(response);
			localStorage.setItem('first_name', update.first_name)
			localStorage.setItem('last_name', update.last_name)
			localStorage.setItem('email', update.email)
		  } catch (err) {
			console.error(err);
			setError('Échec de la mise à jour. Veuillez vérifier vos identifiants.');
		  } finally {
			setIsLoading(false);
		  }
  	}

	return (
		<form onSubmit={handleSubmit} noValidate={false}>
		  	{error && <SetError message={error} />}
		  	{success && <SetSuccess message={success} />}
		  	<TextField required type="text" name="first_name" placeholder="Prénom" value={update.first_name} onChange={handleChange} />
		  	<TextField required type="text" name="last_name" placeholder="Nom" value={update.last_name} onChange={handleChange} />
		  	<TextField required type="text" name="email" placeholder="Email" value={update.email} onChange={handleChange} />
		  	<TextField type="password" name="old_password" placeholder="Votre ancien mot de passe" value={update.old_password} onChange={handleChange} />
		  	<TextField type="password" name="password" placeholder="Mot de passe" value={update.password} onChange={handleChange} />
		  	<TextField type="password" name="check_password" placeholder="Confirmez le mot de passe" value={checkPassword} onChange={handleCheckPasswordChange} />
			<Button type='submit' disabled={isLoading}>{isLoading ? 'Modification en cours...' : 'Modifier le profil'}</Button>
			</form>
	  	);

};

export default UpdateForm;
