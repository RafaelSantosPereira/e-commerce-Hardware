import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './assets/components/Header'
import Home from './assets/components/pages/Home/Home'
import CategoryPage from './assets/components/pages/CategoryPage';
import Detail from './assets/components/pages/Detail';
function App() {

 return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:categoria" element={<CategoryPage />} />
        <Route path="/:categoria/:itemId" element={<Detail />} />

      </Routes>
    </Router>
  );
}

export default App
