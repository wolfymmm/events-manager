import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../features/auth/authSlice';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        EventsManager
      </Link>

      <div className="space-x-6 flex items-center">
        {isAuthenticated ? (
          <>
            <span className="text-gray-600 font-medium">Привіт, {user?.name || 'Друже'}!</span>
            <Link to="/" className="hover:text-blue-500 transition">Події</Link>
            <button 
              onClick={() => dispatch(logout())}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Вийти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-500 transition">Вхід</Link>
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Реєстрація
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;