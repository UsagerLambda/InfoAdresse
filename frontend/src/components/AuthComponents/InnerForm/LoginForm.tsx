import React, {useState} from 'react';
import TextField from '../../common/TextField';
import Button from '../../common/Button';
import { LoginRequest, authService } from '../../../services';
import { SetSuccess } from '../../common/Success';
import { SetError } from '../../common/Error';

const LoginForm: React.FC = () => {
  	const [isLoading, setIsLoading] = useState(false); // Variable pour vérifier l'état actuel du processus de l'api
  	const [error, setError] = useState<string | null>(null); // Variable qui stocke un message d'erreur
  	const [success, setSuccess] = useState<string | null>(null); // Variable qui stocke un message de succès
  	const [login, setLogin] = useState<LoginRequest>({
		username: '',
		password: ''
	  });

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLogin(prev => ({
			...prev,
			[name]: value
		}));
	};

  	const handleSubmit = async () => {
		// Reset les variables setError & SetSuccess //
		setError(null);
		setSuccess(null);
		// ========================================= //

		// Vérifie si tout les champ ont été saisis  //
		if (!login?.password || !login.username) {
			setError("Veuillez saisir toutes vos informations");
			return;
		}
		// ========================================= //

		try {
			setIsLoading(true);

			const credentials = {
				username: login.username,
				password: login.password
			  };
			const response = await authService.login(credentials);

			setSuccess('Vous vous êtes connecté avec succès !')
			console.log(response);
			window.location.href = '/';
		  } catch (err) {
			setError(String(err));
		  } finally {
			setIsLoading(false);
		  }
  	}

	const button_submit = `w-full px-3 py-1 bg-gray-800 text-white text-lg my-2 font-normal border-1 rounded-md hover:bg-gray-600 transition-colors duration-200`

  	return (
    	<>
    		{error && <SetError message={error} />}
    		{success && <SetSuccess message={success} />}

			<div className="w-full mb-4">
    			<TextField label="Email" type="text" name="username" placeholder="Email" value={login.username} onChange={handleChange} className="rounded-md w-full border-1 px-3 py-1 text-lg border-gray-800 my-2"></TextField>
			</div>

			<div className="w-full mb-4">
    			<TextField label="Mot de passe" type="password"name="password" placeholder="Mot de passe" value={login.password} onChange={handleChange} className="rounded-md w-full border-1 px-3 py-1 text-lg border-gray-800 my-2"></TextField>
			</div>

    		<Button onClick={handleSubmit} disabled={isLoading} className={button_submit}>{isLoading ? 'Connexion en cours...' : 'Connexion'}</Button>
    	</>
  	);
};

export default LoginForm;
