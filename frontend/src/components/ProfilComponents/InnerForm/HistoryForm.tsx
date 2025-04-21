import React, {useEffect, useState} from 'react';
import { authService, User } from '../../../services';
import { SetError } from '../../common/Error';
import { SetSuccess } from '../../common/Success';

const HistoryForm: React.FC = () => {
	const [error, setError] = useState<string | null>(null); // Variable qui stocke un message d'erreur
	const [success, setSuccess] = useState<string | null>(null); // Variable qui stocke un message de succès
	const [userData, setUserData] = useState<User | null>(null);
  	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const response = await authService.getCurrentUser();
				setUserData(response);
				setSuccess("")
			} catch (err) {
				setError(String(err));
			} finally {
				setLoading(false);
			}
		};
			fetchHistory();
		}, []);

	const historyItems = userData?.history || [];

	if (loading) {
		return <div>Chargement de l'historique...</div>;
	}

	return (
		<>
			{error && <SetError message={error} />}
			{success && <SetSuccess message={success} />}
			<div>
				<h2>Historique</h2>
				{historyItems.length === 0 ? (
					<p>Aucun élément dans l'historique</p>
				) : (
					<ul>
						{historyItems.map((item, index) => (
							<li key={index}>
								{item}
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	);
};
export default HistoryForm;
