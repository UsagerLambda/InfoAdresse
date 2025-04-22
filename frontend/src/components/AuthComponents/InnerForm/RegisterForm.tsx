import React, {useState} from 'react';
import TextField from '../../common/TextField';
import Button from '../../common/Button';
import { RegisterRequest, authService } from '../../../services';
import { SetSuccess } from '../../common/Success';
import { SetError } from '../../common/Error';

const RegisterForm: React.FC = () => {
  	const [isLoading, setIsLoading] = useState(false); // Variable pour vérifier l'état actuel du processus de l'api
  	const [error, setError] = useState<string | null>(null); // Variable qui stocke un message d'erreur
  	const [success, setSuccess] = useState<string | null>(null); // Variable qui stocke un message de succès
  	const [register, setRegister] = useState<RegisterRequest>({
		first_name: '',
  		last_name: '',
  		email: '',
 		password: ''
	});
	const [checkPassword, setCheckPassword] = useState<string>('');

	const handleCheckPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCheckPassword(e.target.value);
	  };

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setRegister(prev => ({
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
		if (!register.first_name || !register.last_name || !register.email || !register.password || !checkPassword) {
			setError("Veuillez saisir toutes vos informations");
			return;
		}
		// ========================================= //

		if (register.password != checkPassword) {
			setError("Les mots de passe ne correspondent pas");
			return;
		}
		setCheckPassword(''); // Supprime le mot de passe dans la variable

		try {
			setIsLoading(true);

			const credentials = {
				first_name: register.first_name,
				last_name: register.last_name,
				email: register.email,
				password: register.password
			  };
			const response = await authService.register(credentials);

			setSuccess('Vous vous êtes inscris avec succès !')
			console.log(response);
			// Tentative de Login immédiatement après l'inscription ==== //
			try {
				const credentials = {
					username: register.email,
					password: register.password
				};
				const response = await authService.login(credentials);
				console.log(response);
			} catch (err) {
				console.log(err);
			}
			// ========================================================= //
			window.location.href = '/';
		  } catch (err) {
			console.error(err);
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

		<div className="flex gap-4 w-full mb-4">
			<div className="w-1/2">
        		<TextField
					label="Prénom"
					type="text"
					name="first_name"
					placeholder="Prénom"
					value={register.first_name}
					onChange={handleChange}
					className="rounded-md w-full border-1 px-3 py-1 text-lg border-gray-800">
				</TextField>
			</div>
			<div className="w-1/2">
				<TextField
					label="Nom"
					type="text"
					name="last_name"
					placeholder="Nom"
					value={register.last_name}
					onChange={handleChange}
					className="rounded-md w-full border-1 px-3 py-1 text-lg border-gray-800">
				</TextField>
			</div>
		</div>
		<div className="w-full mb-4">
			<TextField
				label="Email"
				type="text"
				name="email"
				placeholder="Email"
				value={register.email}
				onChange={handleChange}
				className="rounded-md w-full border-1 px-3 py-1 text-lg border-gray-800">
			</TextField>
		</div>
		<div className="flex gap-4 w-full mb-4">
			<div className="w-1/2">
        		<TextField
					label="Mot de passe"
					type="password"
					name="password"
					placeholder="Mot de passe"
					value={register.password}
					onChange={handleChange}
					className="rounded-md w-full border-1 px-3 py-1 text-lg border-gray-800">
				</TextField>
			</div>
			<div className="w-1/2">
				<TextField
					label="Confirmation du mot de passe"
					type="password"
					name="check_password"
					placeholder="Confirmez le mot de passe"
					value={checkPassword}
					onChange={handleCheckPasswordChange}
					className="rounded-md w-full border-1 px-3 py-1 text-lg border-gray-800">
				</TextField>
			</div>
		</div>
        <Button onClick={handleSubmit} disabled={isLoading} className={button_submit}>{isLoading ? 'Inscription en cours...' : 'S\'inscrire'}</Button>
    </>
  );
};

export default RegisterForm;
