import React from 'react';
import Button from '../common/Button';
import LoginForm from './InnerForm/LoginForm';
import RegisterForm from './InnerForm/RegisterForm';

interface AuthTabs {
  activeTab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
}

const AuthForm: React.FC<AuthTabs> = ({activeTab, onTabChange}) => {

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
        <div className='item-center mx-auto w-2/5 bg-white rounded-lg shadow-md overflow-hidden my-8'>
            <div className="auth-tabs flex w-full mb-6">

                    <Button onClick={() => onTabChange('login')} className={`w-1/2 text-center py-3 cursor-pointer font-bold relative ${activeTab === 'login' ? 'border-b bg-gray-100 border-b-4' : ''}`}>Connexion</Button>

                    <Button onClick={() => onTabChange('register')} className={`w-1/2 text-center py-3 cursor-pointer font-bold relative ${activeTab === 'register' ? 'border-b bg-gray-100 border-b-4' : ''}`}>Inscription</Button>

            </div>
            <div className="auth-forms m-6">
                {renderForm()}
            </div>
        </div>
    );
};

export default AuthForm;
