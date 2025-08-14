import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './assets/components/Header'
import Home from './assets/components/pages/Home/Home'
import CategoryPage from './assets/components/pages/CategoryPage';
import Detail from './assets/components/pages/Detail';
import Login from './assets/components/pages/Login';
import SignIn from './assets/components/pages/SignIn';
function App() {
  
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:categoria" element={<CategoryPage />} />
            <Route path="/:categoria/:id" element={<Detail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/SignIn" element={<SignIn />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App
