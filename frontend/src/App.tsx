import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import Auth from './pages/AuthPage';
import Profil from './pages/ProfilPage';
import Other from './pages/OtherPage';
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import './services/authChecker';

const App = () => {
  return (
    <>
      <Header />
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/*" element={<Other />} />
          </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
};

export default App;
