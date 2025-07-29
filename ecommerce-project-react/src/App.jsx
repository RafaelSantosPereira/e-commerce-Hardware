import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './assets/components/Header'
import Home from './assets/components/pages/Home/Home'
import CategoryPage from './assets/components/CategoryPage';

function App() {

 return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:categoria" element={<CategoryPage />} />
      </Routes>
    </Router>
  );
}

export default App
