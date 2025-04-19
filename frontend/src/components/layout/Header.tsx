import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const Header: React.FC = () => {
  const isLoggedIn = api.isAuthenticated();
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      api.getCurrentUser()
        .then(user => setUserInfo(user))
        .catch(err => console.error("Failed to load user info", err));
    }
  }, [isLoggedIn]);

    return (
      <header className="flex justify-between items-center px-8 py-4 bg-gray-100 shadow-sm">
        <a href="/" className="text-xl font-bold text-gray-800 no-underline">InfoAdresse</a>
        <div className="flex gap-2">
          {isLoggedIn && userInfo ? (
            <>
            <a href="/profile" className="user-menu-btn flex items-center cursor-pointer">
            <div className="user-avatar w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mr-2">
              {userInfo.first_name.charAt(0)}
            </div>
            <span>{userInfo.first_name} {userInfo.last_name}</span>
          </a>
          </>
            ) : (
              <>
                <a href="/auth#login">
                  <button className="px-4 py-1 border border-gray-800 bg-transparent text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200">
                    Connexion
                  </button>
                </a>
               <a href="/auth#register">
                  <button className="px-4 py-1 border-none bg-gray-800 text-white hover:bg-gray-900 rounded-full transition-all duration-200">
                    Inscription
                  </button>
                </a>
              </>
          )}
        </div>
      </header>
    );
  };

export default Header;
