const CHECK_INTERVAL = 1000;

function checkAuthConditions() {
    const authToken = localStorage.getItem('authToken');
    const currentUrl = window.location.href;

        // Si l'utilisateur n'est pas indentifié mais que le localStorage n'est pas vide
        if (!authToken && localStorage.length !== 0) {
            localStorage.clear();
            window.location.href = '/';

        // Si l'utilisateur n'est pas authentifié mais qu'il ce trouve sur la page de profil
        } else if (!authToken && currentUrl.includes('/profil')) {
            localStorage.clear();
            window.location.href = '/';

        // Si l'utilisateur a un localStorage vide et qu'il ce trouve sur la page de profil
        } else if (localStorage.length === 0 && currentUrl.includes('/profil')) {
            window.location.href = '/';
    }
}
checkAuthConditions();

const intervalId = setInterval(checkAuthConditions, CHECK_INTERVAL);

export const stopAuthChecker = () => {
    clearInterval(intervalId);
  };

export const checkNow = checkAuthConditions;
