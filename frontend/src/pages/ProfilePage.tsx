import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProfileForm from '../components/profile/profileForm'
import { useState } from 'react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'profil' | 'address' | 'settings'>('profil');
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          < ProfileForm
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </main>
        <Footer />
      </div>
    );
  };

  export default Profile;
