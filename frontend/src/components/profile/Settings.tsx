import Button from '../common/Button'
import { useState } from 'react';
import api from '../../services/api'
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();


    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");

        if (!confirmDelete) {
            return;
        }

            setLoading(true); // active l'état de chargement (pour le bouton submit)
            setError(null); // clear le setError
            setSuccess(null); // clear le setSuccess

            try {
                await api.deleteAccount();

                setSuccess('Votre compte a été supprimé avec succès.');
                setLoading(false);

                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } catch (err) {
                setError('Échec de la suppression du compte. Veuillez réessayer plus tard.');
                console.error(err);
                setLoading(false);
            }
        };

    return (
        <div className="flex flex-col space-y-4">
            {error && <div className="text-red-500 p-2 bg-red-50 rounded">{error}</div>}
            {success && <div className="text-green-500 p-2 bg-green-50 rounded">{success}</div>}

        <Button
            onClick={handleDeleteAccount}
            variant='solid'
            fullWidth={true}
            disabled={loading}
            className="w-full py-3 bg-red-500 text-white rounded-lg text-base cursor-pointer transition-colors hover:bg-red-600 disabled:bg-red-200 disabled:cursor-not-allowed"
        >
            {loading ? 'Suppression en cours...' : 'Supprimer le compte'}
        </Button>
    </div>
    );
}

  export default Settings;
