import { useEffect } from 'react';

const CheckLocalStorage = (checkIntervalSeconds = 10) => {
    useEffect(() => {
        const checkAuthToken = () => {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            localStorage.clear();
            window.location.href = '/';
        }
    };
    checkAuthToken();
    const intervalId = setInterval(checkAuthToken, checkIntervalSeconds * 1000);

    return () => {
        clearInterval(intervalId);
        };
    }, [checkIntervalSeconds]);
};

export default CheckLocalStorage;
