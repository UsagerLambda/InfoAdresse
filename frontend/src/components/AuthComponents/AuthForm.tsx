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
        <>
            <Button onClick={() => onTabChange('login')}>Connexion</Button>
            <Button onClick={() => onTabChange('register')}>Inscription</Button>
            {renderForm()}
        </>
    );
};

export default AuthForm;
