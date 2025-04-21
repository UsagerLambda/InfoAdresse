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

  	return (
    	<>
    		{error && <SetError message={error} />}
    		{success && <SetSuccess message={success} />}
    		<TextField type="text" name="username" placeholder="Email" value={login.username} onChange={handleChange}></TextField>
    		<TextField type="password"name="password" placeholder="Mot de passe" value={login.password} onChange={handleChange}></TextField>
    		<Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Connexion en cours...' : 'Connexion'}</Button>
    	</>
  	);
};

export default LoginForm;
