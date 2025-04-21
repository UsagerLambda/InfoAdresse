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

	return (
    	<>
			<h2>Recherchez une adresse</h2>
			<div>Saisissez une adresse complète</div>
      		<TextField placeholder="Ex: 20 avenue de Ségur, 75007 Paris" value={address} onChange={(e) => setAddress(e.target.value)}></TextField>
			<Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Recherche en cours...' : 'Rechercher'}</Button>

			{error && <SetError message={error} />}
			{success && <SetSuccess message={success} />}

			{showResults && searchResult && <ResultForm result={searchResult} visible={showResults} />}
    	</>
  	);
};

export default SearchForm;
