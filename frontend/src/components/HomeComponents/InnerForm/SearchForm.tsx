import React, {useState} from 'react';
import TextField from '../../common/TextField';
import Button from '../../common/Button';
import ResultForm from './ResultForm';
import {addressService, AddressSearchResult, apiService, authService} from '../../../services/index';
import { SetSuccess } from '../../common/Success';
import { SetError } from '../../common/Error';

const SearchForm: React.FC = () => {
	const [address, setAddress] = useState(''); // Variable pour stocker l'adresse
	const [isLoading, setIsLoading] = useState(false); // Variable pour vérifier l'état actuel du processus de l'api
	const [searchResult, setSearchResult] = useState<AddressSearchResult | null>(null); // Variable qui prend pour modèle AddressSearchResult
	const [showResults, setShowResults] = useState(false); // Variable bool pour afficher le résultat de l'appel api ou non
	const [error, setError] = useState<string | null>(null); // Variable qui stocke un message d'erreur
	const [success, setSuccess] = useState<string | null>(null); // Variable qui stocke un message de succès

	const handleSubmit = async () => {
		// Reset les variables setError & SetSuccess //
		setError(null);
		setSuccess(null);
		// ========================================= //

		// Si pas d'adresses données =============== //
		if (!address.trim()) {
			setError("Veuillez saisir une adresse");
			return;
		}
		// ========================================= //

		// Si l'utilisateur est loggé ============== //
		if (apiService.isAuthenticated()) {
			authService.addToHistory(address);
		}
		// ========================================= //

		try {
			setIsLoading(true);
			const response = await addressService.searchAddress(address);
			setSearchResult(response);
			setShowResults(true);
			setSuccess("Les infos de l'adresse ont été récupérées avec succès");
		} catch (err) {
			setError(String(err));
		} finally {
			setIsLoading(false);
		}
	}

	const button_submit = `w-full px-3 py-1 bg-gray-800 text-white text-lg my-2 font-normal border-1 rounded-md hover:bg-gray-600 transition-colors duration-200`

	return (
		<>
			<div className='text-center py-5'>
				<h1 className='font-semibold text-5xl py-5'>Toutes les informations sur une adresse</h1>
				<h3 className='font-medium text-xl text-gray-600'>Cadastre, PLU, risques naturels, démographie et plus encore en quelques secondes.</h3>
			</div>
    		<div className='p-4 px-7 item-center mx-auto w-4/7 bg-white rounded-lg shadow-md overflow-hidden my-8'>
				<h2 className='font-semibold text-2xl py-5'>Recherchez une adresse</h2>
				<div>Saisissez une adresse complète</div>
      			<TextField
					placeholder="Ex: 20 avenue de Ségur, 75007 Paris"
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					className="rounded-md w-full border-1 px-3 py-1 text-lg border-gray-800 my-2"
					>
				</TextField>
				<Button onClick={handleSubmit} disabled={isLoading} className={button_submit}>{isLoading ? 'Recherche en cours...' : 'Rechercher'}</Button>

				{error && <SetError message={error} />}
				{success && <SetSuccess message={success} />}
			</div>
			<div >
				{showResults && searchResult && <ResultForm result={searchResult} visible={showResults}/>}
    		</div>
		</>
  	);
};

export default SearchForm;
