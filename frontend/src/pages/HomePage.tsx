import Header from '../components/layout/Header';
import HeroSection from '../components/layout/HeroSection';
import SearchForm from '../components/search/SearchForm';
import Footer from '../components/layout/Footer';

const Home = () => {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <HeroSection />
          <SearchForm />
        </main>
        <Footer />
      </div>
    );
  };

  export default Home;
