import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // USER IMAGE LOAD ON NAVBAR AT START / REFRESH / LOGIN   
    if (user) {
      if (user.image) {
        document.querySelector('.navbar__image').src = user.image;
      }
    }
  }, [user]);

  const isActive = (path) => router.pathname === path;

  return (
    <nav className="navbar">
      <ul className="navbar__list">
        <li className={`navbar__item ${isActive('/') ? 'navbar__item--selected' : ''}`}>
          <Link href="/">Home</Link>
        </li>
        {user ? (
          <>
          {user.image && <li className="navbar__item"><img src={user.image} alt={user.name} className="navbar__image" /></li>}
            <li className="navbar__item user">Hello, {user.name}</li>
            <li className="navbar__item">
              <a className="navbar__link" onClick={logout}>Logout</a>
            </li>
          </>
        ) : (
          <>
            <li className={`navbar__item ${isActive('/login') ? 'navbar__item--selected' : ''}`}>
              <Link href="/login">Login</Link>
            </li>
            <li className={`navbar__item ${isActive('/signup') ? 'navbar__item--selected' : ''}`}>
              <Link href="/signup">Signup</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
