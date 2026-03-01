import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store/hooks';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import EventsList from './pages/EventsList/EventsList';
import Navbar from './components/Navbar/Navbar';

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
        <Navbar /> {/* Тут тепер твої посилання Link */}
        
        <main className="container mx-auto px-4 py-10">
          <Routes>
            {/* Якщо залогінений — на івенти, якщо ні — на логін */}
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
            
            <Route path="/" element={isAuthenticated ? <EventsList /> : <Navigate to="/login" />} />
            
            {/* Авто-редирект будь-якого невідомого шляху */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;