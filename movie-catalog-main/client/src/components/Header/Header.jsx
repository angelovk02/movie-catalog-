import headerStyles from './Header.module.css';
import { useAuth } from '../../Contexts/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { authenticated, user } = useAuth();

  // Example: check admin by email or displayName
  const isAdmin = user?.email === "admin00@email.com"; // or user?.displayName === "Admin00"

  return (
    <header>
      <nav>
        <ul>
          <li className={headerStyles.left}><Link to="/">Home</Link></li>
          <li className={headerStyles.left}><Link to="/movies">Movies</Link></li>

          {authenticated && isAdmin && (
            <li className={headerStyles.left}><Link to="/create-movie">Create Movie</Link></li>
          )}

          {authenticated ? (
            <>
              <li className={headerStyles.right}><Link to="/logout">Logout</Link></li>
              <li className={headerStyles.right}><Link to="/profile">Profile</Link></li>
            </>
          ) : (
            <>
              <li className={headerStyles.right}><Link to="/login">Login</Link></li>
              <li className={headerStyles.right}><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
