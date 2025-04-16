import Header from './components/layout/Header';
import SearchForm from './components/search/SearchForm'

const App = () => {
  return (
    <div className="app">
      <Header />
      <main>
        <SearchForm />
      </main>
    </div>
  );
};

export default App;
