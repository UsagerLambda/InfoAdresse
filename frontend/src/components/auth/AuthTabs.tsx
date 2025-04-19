import React from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthTabsProps {
  activeTab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange }) => {
    const renderForm = () => {
        switch (activeTab) {
          case 'login':
            return <LoginForm />;
          case 'register':
            return <RegisterForm />;
          default:
            return <LoginForm />;
        }
      };

    return (
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b border-gray-200">
                <div
                    className={`flex-1 text-center py-4 px-4 font-bold cursor-pointer transition-colors duration-300
                    ${activeTab === 'login' ? 'bg-gray-100 border-b-2 border-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                    onClick={() => onTabChange('login')}
                    >Connexion</div>
                 <div
                    className={`flex-1 text-center py-4 px-4 font-bold cursor-pointer transition-colors duration-300
                    ${activeTab === 'register' ? 'bg-gray-100 border-b-2 border-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                    onClick={() => onTabChange('register')}
                    >Inscription</div>
                </div>
                    <div className="p-8">
                    {renderForm()}
                </div>
            </div>
        );
    };

export default AuthTabs;
