import AuthForm from "../components/AuthComponents/AuthForm";
import { useState, useEffect } from 'react';

const Auth = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    useEffect(() => {
        if (window.location.hash === '#register') {
            setActiveTab('register');
        } else if (window.location.hash === '#login') {
            setActiveTab('login');
        }
    }, []);

    return (
        <>
            <AuthForm
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </>
    )
};

export default Auth
