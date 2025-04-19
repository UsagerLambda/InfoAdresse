import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AuthTab from '../components/auth/AuthTabs';
import { useState } from 'react';

const Auth = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    return (
      <div className="flex flex-col min-h-screen bg-white-100">
        <Header />
        <main className="flex-grow px-4 py-8">
         <AuthTab
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
        </main>
        <Footer />
      </div>
    );
  };

  export default Auth;
