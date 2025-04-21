import ProfilForm from "../components/ProfilComponents/ProfilForm";
import { useState } from 'react';

const Profil = () => {
    const [activeTab, setActiveTab] = useState<'profil' | 'adresse' | 'settings'>('profil');
    return (
        <>
            <ProfilForm
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
        </>
    )
};

export default Profil
